var database = require("./database");

/**
 * Settings keys and their types.
 *
 */
const SETTINGS = {
	"smtp.host": "string",
	"smtp.port": "integer",
	"smtp.secure": "boolean",
	"smtp.auth_user": "string",
	"smtp.auth_pass": "string",
	"smtp.from_email": "string",
	"smtp.from_name": "string",
	"users.enable_registration": "boolean",
};


var Settings = function() {
	var data = {};
}


Settings.prototype.init = function() {
	return this.ensureDefaults()
		.then(this.reloadSettings())
}


/**
 * Get single or multiple settings
 *
 * @param string|array of keys
 *
 */
Settings.prototype.get = function(key) {
	if (Array.isArray(key)) {
		var value = {};
		key.forEach(key => {
			value[key] = typeof(this.data[key]) === 'undefined' ? null : this.data[key]['value'];
		});
		return value;
	} else {
		return typeof(this.data[key]) === 'undefined' ? null : this.data[key]['value'];
	}
};


/**
 * Get all settings
 *
 */
Settings.prototype.getAll = function() {
	var settings = {};
	for (const key in this.data) {
		settings[key] = this.data[key]['value'];
	}
	return settings;
};


/**
 * Insert (or ignore) the default settings to ensure the types are set correctly.
 *
 */
Settings.prototype.ensureDefaults = function() {

	var self = this;

	return new Promise(function(resolve, reject) {

		var sql = "INSERT OR IGNORE INTO settings(`key`, `value`, `type`) VALUES ($key, $value, $type)";
		var db = database.getDb();
		var stmt = db.prepare(sql);

		var keys = Object.keys(SETTINGS),
			params = {},
			inserted = 0;

		keys.forEach(function(key) {

			console.log(`Registering setting ${key}...`);

			params = {
				$key: key,
				$type: SETTINGS[key],
				$value: null,
			};

			stmt.run(params, function(err) {
				inserted++;
				if (inserted >= keys.length) {
					resolve();
				}
			});

		});

	});

}


/**
 * Reload all the DB settings into local cache.
 * Call this after every insert/update/delete.
 *
 */
Settings.prototype.reloadSettings = function() {
	return this.getSettings().then(settings => this.data = settings);
}


/**
 * Get all current settings from database.
 *
 * Values are returned in { key: value } format, with the value properly formatted according to the type.
 *
 */
Settings.prototype.getSettings = function() {

	var self = this;

	return new Promise(function(resolve, reject) {

		var sql = "SELECT * FROM `settings`";
		var db = database.getDb();
		var stmt = db.prepare(sql);

		stmt.all(function(err, rows) {

			stmt.finalize();

			if (err) return reject(err);

			var settings = {};
			rows.forEach(function(row) {
				var formattedRow = self.wakeValue(row);
				settings[ formattedRow.key ] = {
					type: formattedRow.type,
					value: formattedRow.value,
				}
			});

			return resolve(settings);
		});

	});

}


/**
 * Set one or more keys/values.
 *
 */
Settings.prototype.set = function(key, value, type) {

	var data = {};

	// Standardise the format

	if (typeof(key) == 'string') {
		// One row: all params supplied
		data[key] = {
			value: value,
			type: type,
		}
	} else if (typeof(key) == 'object') {
		// Key is an object of { key: value } OR { key: { value: '', type: '' }}
		data = {...key};
	} else {
		throw "Settings: set(): type of key parameter must be string or object";
	}

	return new Promise((resolve, reject) => {

		var sql = "INSERT OR REPLACE INTO settings(`key`, `value`, `type`) VALUES ($key, $value, $type)";
		var db = database.getDb();
		var stmt = db.prepare(sql);

		var params = {},
			row = {},
			formattedRow,
			inserted = 0;

		db.run("BEGIN TRANSACTION");

		for (const key in data) {

			row = {
				key: key,
			};

			if (typeof(data[key]) === 'object' && data[key].hasOwnProperty('value')) {
				// Use value and type properties of object
				row.value = data[key]['value'];
				row.type = data[key]['type'];
			} else {
				// No value given, use the key's value as the actual value and get the type from already-loaded data (if present; otherwise presume string)
				row.value = data[key];
				row.type = (typeof(this.data[key]) !== 'undefined' ? this.data[key]['type'] : 'string');
			}

			formattedRow = this.sleepValue(row);

			params = {
				$key: formattedRow.key,
				$value: formattedRow.value,
				$type: formattedRow.type,
			};

			stmt.run(params, (err) => {

				if (err) { reject(err); }

				inserted++;
				if (inserted >= Object.keys(data).length) {
					stmt.finalize();
					db.run("COMMIT");
					// console.log("Finished saving settings!");
					this.reloadSettings().then(() => resolve());
				}

			});

		}

	});

}



/**
 * Format a DB setting row according to the `type` property.
 *
 */
Settings.prototype.wakeValue = function(row) {

	switch (row.type) {
		case 'integer':
			row.value = parseInt(row.value, 10);
		break;
		case 'boolean':
			switch (row.value) {
				case 1:
				case '1':
				case 'true':
					row.value = true;
				break;
				case 0:
				case '0':
				case 'false':
				default:
					row.value = false;
				break;
			}
		break;
		case 'json':
			row.value = JSON.parse(row.value);
		break;
	}

	return row;
}


Settings.prototype.sleepValue = function(row) {

	switch (row.type) {
		case 'json':
			row.value = JSON.stringify(row);
		break;
	}

	return row;
}

module.exports = (new Settings());
