var fs = require("fs"),
	path = require("path"),
	bcrypt = require("bcryptjs"),
	jwt = require('jsonwebtoken'),
	settings = require("./settings"),
	database = require("./database");

const STATUS_OPTIONS = {
	'CREATED': 5,
	'VERIFIED': 10,
	'DISABLED': 15,
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


Users.prototype.getAll = function() {

	var self = this;

	return new Promise(function(resolve, reject) {

		var sql = "SELECT * FROM `users` ORDER BY email ASC";
		var db = database.getDb();
		var stmt = db.prepare(sql);

		stmt.all(function(err, rows) {

			stmt.finalize();

			if (err) return reject(err);

			var users = rows.map(function(row) {
				var user = self.wakeValue(row);
				delete user.password;
				return user;
			});

			return resolve(users);
		});

	});

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
			if ( ! user) {
				console.log(`User ID ${id} not found.`);
				return reject('not_found');
			}
			return resolve(self.wakeValue(user));
		});

	});
};


/**
 * Get user by email
 *
 */
Users.prototype.getByEmail = function(email) {

	var self = this;

	return new Promise(function(resolve, reject) {

		var sql = "SELECT * FROM `users` WHERE email = ?";
		var db = database.getDb();
		var stmt = db.prepare(sql);

		stmt.get([email], function(err, user) {
			stmt.finalize();
			if (err) { return reject('error'); }
			if ( ! user) {
				return resolve(null);
			}
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
 * Format a DB user row.
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
 * Invite a new user.
 *
 * - Create user account.
 * - Send invitation email.
 *
 * @param userParams Object of 'email', 'name' and 'roles'.
 * @param hostname Hostname of running instance, for email template.
 *
 */
Users.prototype.invite = function(userParams, hostname) {

	var user = {
		email: userParams.email,
		name: userParams.name,
		status: 5,
		roles: userParams.roles ? userParams.roles : [],
	};

	return this.insertUser(user)
		.then((id) => { this.sendInviteEmail(id, hostname) })

}


/**
 * Register a new user
 *
 * - Create user account.
 * - Send confirmation email.
 *
 * @param userParams Object of 'email' and 'name'.
 * @param hostname Hostname of running instance, for email template.
 *
 */
Users.prototype.register = function(userParams, hostname) {

	var user = {
		name: userParams.name,
		email: userParams.email,
		status: 5,
		roles: ['view'],
	};

	return this.insertUser(user)
		.then((id) => { this.sendConfirmEmail(id, hostname) })

}


/**
 * Send an invitation email to the requested user ID.
 *
 */
Users.prototype.sendInviteEmail = function(id, hostname) {

	return this.getById(id)

		.then((user) => {

			const status = parseInt(user.status, 10);
			if (status !== STATUS_OPTIONS.CREATED) {
				throw new Error("User status is already verified or account disabled.");
			}

			const payload = {
				iss: 'livinglab',
				sub: user.id,
			};

			const secret = settings.get('users.verify_secret');

			const token = jwt.sign(payload, secret, { expiresIn: '30m' });

			const url = `http://${hostname}/admin/account/verify_email/${user.id}#${token}`;

			var vars = {
				url: url,
				id: id,
				app_name: "Living Lab"
			};

			return mailer.send({
				subject: "Living Lab invitation",
				to: user.email,
				template: 'user_invite',
				vars: vars,
			});

		});
}


/**
 * Send a confirmation email to the requested user ID.
 *
 */
Users.prototype.sendConfirmEmail = function(id, hostname) {

	return this.getById(id)

		.then((user) => {

			const status = parseInt(user.status, 10);
			if (status !== STATUS_OPTIONS.CREATED) {
				throw new Error("User status is already verified or account disabled.");
			}

			const payload = {
				iss: 'livinglab',
				sub: user.id,
			};

			const secret = settings.get('users.verify_secret');

			const token = jwt.sign(payload, secret, { expiresIn: '30m' });

			const url = `http://${hostname}/admin/account/verify_email/${user.id}#${token}`;

			var vars = {
				url: url,
				id: id,
				app_name: "Living Lab"
			};

			return mailer.send({
				subject: "Living Lab registration",
				to: user.email,
				template: 'user_register',
				vars: vars,
			});

		});
}


/**
 * Check an email verification token (JWT) for a user for validity.
 *
 * @param userId ID of user
 * @param token JWT string
 *
 */
Users.prototype.checkVerifyToken = function(userId, token) {

	return this.getById(userId)

		.then((user) => {

			const status = parseInt(user.status, 10);
			if (status !== STATUS_OPTIONS.CREATED) {
				throw new Error("User status is already verified or account disabled.");
			}

			const options = {
				algorithms: ['HS256'],
				issuer: 'livinglab',
				subject: user.id,
			};

			const secret = settings.get('users.verify_secret');

			try {
				var payload = jwt.verify(token, secret, options);
			} catch (err) {
				throw err.message;
			}

			var newUser = {...user};
			delete newUser.password;

			return {
				user: newUser,
				payload: payload,
			}
		});

}


/**
 * Set initial password for user, using a JWT (from invite/register) as validation.
 *
 * @param userId ID of user
 * @param token JWT string
 * @param password New password for user
 *
 */
Users.prototype.setInitialPassword = function(userId, token, password) {

	return this.getById(userId)

		.then((user) => {

			const status = parseInt(user.status, 10);
			if (status !== STATUS_OPTIONS.CREATED) {
				throw new Error("User status is already verified or account disabled.");
			}

			const options = {
				algorithms: ['HS256'],
				issuer: 'livinglab',
				subject: user.id,
			};

			const secret = settings.get('users.verify_secret');

			try {
				var payload = jwt.verify(token, secret, options);
			} catch (err) {
				throw err.message;
			}

			const params = {
				$id: user.id,
				$status: STATUS_OPTIONS.VERIFIED,
				$password_hash: bcrypt.hashSync(password, 8),
				$modified_at: (new Date()).toUTCString(),
			};

			var sql = "UPDATE `users` SET status = $status, password = $password_hash, modified_at = $modified_at WHERE id = $id";
			var db = database.getDb();
			var stmt = db.prepare(sql);

			return new Promise((resolve,reject) => {
				stmt.run(params, (err) => {
					if (err) { reject(err); }
					resolve(this.getById(user.id));
				});
			});

		});

}


/**
 * Create a user account.
 *
 */
Users.prototype.insertUser = function(user) {

	if ( ! user.roles || typeof(user.roles) === 'undefined') {
		user.roles = [];
	}

	var params = {
		$status: user.status,
		$email: user.email,
		$name: user.name,
		$password_hash: null,
		$roles_json: JSON.stringify(user.roles),
		$created_at: (new Date()).toUTCString(),
		$modified_at: null,
	};

	if (user && user.password && user.password.length > 0) {

		var hashRegex = /^\$2a\$/,
			passwordHash = null;

		if (hashRegex.test(user.password)) {
			passwordHash = user.password;
		} else {
			passwordHash = bcrypt.hashSync(user.password, 8);
		}

		params.$password_hash = passwordHash;
	}

	var sql = "INSERT INTO `users` "
			+ "(status, email, password, name, roles, created_at, modified_at) "
			+ "VALUES "
			+ "($status, $email, $password_hash, $name, $roles_json, $created_at, $modified_at);";

	var db = database.getDb();
	var stmt = db.prepare(sql);

	return this.getByEmail(user.email)
		.then((existingUser) => {
			if (existingUser) {
				throw new Error("Already exists");
			}
			return existingUser;
		})
		.then((existingUser) => {
			return new Promise((resolve, reject) => {
				stmt.run(params, (err) => {
					if (err) {
						reject(err.toString());
					}
					resolve(parseInt(stmt.lastID.toString(), 10));
				});
			});
		});
}


/**
 * Update a user record with the given values.
 *
 */
Users.prototype.updateUser = function(userId, userValues) {

	// List of keys we can safely set using this method.
	//
	const keysWhitelist = [
		'email',
		'name',
		'password',
		'roles',
		'status',
	];

	return this.getById(userId)

		.then((user) => {

			var safeUser = {};
			var value = null;
			var hashRegex = /^\$2a\$/;

			keysWhitelist.forEach(key => {
				if (typeof(userValues[key]) !== 'undefined') {
					value = userValues[key];
					if (key == 'password' && value.length > 0 && ! hashRegex.test(value)) {
						// Hash password if not already
						value = bcrypt.hashSync(userValues.password, 8);
					}
					safeUser[key] = value;
				}
			});

			const userData = { ...user, ...safeUser };

			const params = {
				$id: user.id,
				$email: userData.email,
				$name: userData.name,
				$password_hash: userData.password,
				$roles_json: JSON.stringify(userData.roles),
				$status: parseInt(userData.status, 10),
				$modified_at: (new Date()).toUTCString(),
			};

			var sql = "UPDATE `users` "
					+ "SET email = $email, name = $name, password = $password_hash, roles = $roles_json, status = $status, modified_at = $modified_at "
					+ "WHERE id = $id";

			var db = database.getDb();
			var stmt = db.prepare(sql);

			return new Promise((resolve,reject) => {
				stmt.run(params, (err) => {
					if (err) {
						if (err.code == 'SQLITE_CONSTRAINT') {
							return reject("Already exists.");
						}
						reject(err);
					}
					resolve(this.getById(user.id));
				});
			});

		});

}


/**
 * Delete a given user by ID.
 *
 */
Users.prototype.deleteUser = function(userId) {

	return this.getById(userId)

		.then((user) => {

			var sql = "DELETE FROM `users` WHERE id = $id";
			var db = database.getDb();
			var stmt = db.prepare(sql);

			var params = { $id: user.id };

			return new Promise((resolve,reject) => {
				stmt.run(params, (err) => {
					if (err) { reject(err); }
					resolve(true);
				});
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


//
// Legacy file-based user functions below...
//


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

				var hasAdmin = false;

				users.forEach((oldUser) => {
					if (oldUser.roles.indexOf('admin') !== -1) {
						hasAdmin = true;
					}
				});

				if ( ! hasAdmin) {
					users.push({
						username: 'admin_user',
						password: 'admin_password',
						roles: ['admin', 'edit', 'view'],
					});
				}

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
