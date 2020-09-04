var fs = require("fs"),
	path = require("path"),
	bcrypt = require("bcryptjs"),
	database = require("./database");

const STATUS_OPTIONS = {
	'CREATED': 5,
	'VERIFIED': 10,
};


var Users = function(params) {
	var usersFilePath = path.join(process.cwd(), "config", "users.json");
	this.usersFileExists = fs.existsSync(usersFilePath);
	if (this.usersFileExists) {
		this.usersFile = fs.realpathSync(usersFilePath);
	}
}


Users.prototype.init = function() {
	if (this.usersFileExists) {
		this.hashPasswords();
		this.importIntoDb();
	}
}


/**
 * Get user by ID
 *
 */
Users.prototype.getById = function(id) {

	var self = this;

	return new Promise(function(resolve, reject) {

		var sql = "SELECT * FROM `users` WHERE id = ?";
		var db = database.getDb();
		var stmt = db.prepare(sql);

		stmt.get([id], function(err, user) {
			stmt.finalize();
			if (err) { return reject('error'); }
			if ( ! user) { return reject('not_found'); }
			return resolve(self.wakeValue(user));
		});

	});
};


/**
 * Authenticate a user with email + supplied password.
 *
 */
Users.prototype.authenticate = function(email, password) {

	var self = this;

	return new Promise(function(resolve, reject) {

		var sql = "SELECT * FROM `users` WHERE email = ?";
		var db = database.getDb();
		var stmt = db.prepare(sql);

		stmt.get([email], function(err, user) {

			stmt.finalize();

			if (err) { return reject('error'); }
			if ( ! user) { return reject('not_found'); }

			if ( ! bcrypt.compareSync(password, user.password)) {
				return reject('bad_password');
			}

			return resolve(self.wakeValue(user));

		});

	});

};


/**
 * Format a DB user row
 *
 */
Users.prototype.wakeValue = function(row) {

	if (row.roles && row.roles.length > 0) {
		row.roles = JSON.parse(row.roles);
	} else {
		row.roles = [];
	}

	return row;
}


/**
 * Create a new user account
 *
 */
Users.prototype.insertUser = function(user) {

	return new Promise(function(resolve, reject) {

		var hashRegex = /^\$2a\$/,
			passwordHash = null;

		if (hashRegex.test(user.password)) {
			passwordHash = user.password;
		} else {
			passwordHash = bcrypt.hashSync(user.password, 8);
		}

		var params = {
			$status: user.status,
			$email: user.email,
			$passwordHash: passwordHash,
			$name: user.name,
			$rolesJson: JSON.stringify(user.roles),
			$created_at: (new Date()).toUTCString(),
			$modified_at: null,
		};

		var sql = "INSERT INTO `users` "
				+ "(status, email, password, name, roles, created_at, modified_at) "
				+ "VALUES "
				+ "($status, $email, $passwordHash, $name, $rolesJson, $created_at, $modified_at);";

		var db = database.getDb();
		var stmt = db.prepare(sql);

		stmt.run(params, function(err) {
			if (err) {
				return reject(err);
			}
			return resolve(parseInt(stmt.lastID.toString(), 10));
		});

	});
}


/**
 * Count the number of users in the DB.
 *
 */
Users.prototype.getUserCount = function(numUsers) {
	return new Promise(function(resolve, reject) {
		var db = database.getDb();
		var sql = "SELECT COUNT(id) AS numUsers FROM users";
		db.get(sql, function(err, row) {
			if (row === undefined) {
				return resolve(0);
			}
			if (err) {
				return resolve(0)
			}
			return resolve(row.numUsers);
		});
	});
}


/**
 * If the local file exists, and there are no existing users, then import them into the database.
 *
 */
Users.prototype.importIntoDb = function() {

	this.getUserCount()
		.then(checkFile)
		.then(transformUsers)
		.then(importUsers)
		.then(renameOldFile)
		.catch(function(msg) {
			console.error(msg);
		});

	var self = this;

	function checkFile(numUsers) {
		return new Promise(function(resolve, reject) {
			if (numUsers > 0) {
				return reject("Users already exist in DB.");
			}
			self.getUsersFromFile(function(users) {
				return resolve(users);
			});
		});
	};

	function transformUsers(oldUsers) {
		return new Promise(function(resolve, reject) {
			var newUsers = oldUsers.map(function(fileUser) {
				return {
					status: STATUS_OPTIONS.VERIFIED,
					email: fileUser.username,
					name: fileUser.username,
					password: fileUser.password,
					roles: fileUser.roles,
				};
			});
			return resolve(newUsers);
		});
	};

	function importUsers(newUsers) {
		return new Promise(function(resolve, reject) {
			if (newUsers.length === 0) {
				return reject("No users found.");
			}
			var inserted = 0;
			newUsers.forEach(function(newUser) {

				self.insertUser(newUser).then(function(newUserId) {
					inserted++;
					console.log("Added user " + newUser.name + " to DB: #" + newUserId);
					if (inserted >= newUsers.length) {
						resolve();
					}
				});

			});
		});
	};

	function renameOldFile() {
		return new Promise(function(resolve, reject) {
			var currentPath = fs.realpathSync(path.join(process.cwd(), "config", "users.json"));
			var newPath = path.join(process.cwd(), "config", "users.legacy.json");
			fs.rename(currentPath, newPath, function (err) {
				if (err) return reject(err);
				console.log("Moved users.json file to users.legacy.json.");
				return resolve();
			});
		});
	};

}


Users.prototype.hashPasswords = function() {

	var self = this;

	this.getUsersFromFile(function(users) {

		var out = [],
			hashed = 0,
			hashRegex = /^\$2a\$/;

		users.forEach(function(user) {

			if (hashRegex.test(user.password)) {
				out.push(user);
			} else {
				var hash = bcrypt.hashSync(user.password, 8);
				user.password = hash;
				out.push(user);
				hashed++;
			}

		});

		if (hashed > 0) {
			console.log("Updated users list with hashed passwords for " + hashed + " user(s).");
			self.setUsers(out);
		}

	});
}


Users.prototype.getUsersFromFile = function(cb) {
	fs.readFile(this.usersFile, function(error, content) {
		cb(JSON.parse(content));
	});
}


Users.prototype.checkPassword = function(password, hash) {
	return bcrypt.compareSync(password, hash);
}


module.exports = (new Users());
