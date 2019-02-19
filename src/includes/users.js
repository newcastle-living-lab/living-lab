var fs = require("fs"),
	path = require("path"),
	bcrypt = require("bcryptjs");


var Users = function(params) {
	this.usersFile = fs.realpathSync(path.join(process.cwd(), "config", "users.json"));
}


Users.prototype.init = function() {
	this.hashPasswords();
}


Users.prototype.hashPasswords = function() {

	var self = this;

	this.getUsers(function(users) {

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


Users.prototype.getUsers = function(cb) {

	fs.readFile(this.usersFile, function(error, content) {
		cb(JSON.parse(content));
	});

}


Users.prototype.setUsers = function(users) {
	fs.writeFile(this.usersFile, JSON.stringify(users, null, 4),  function(err) {});
}


Users.prototype.findByUsername = function(username, cb) {

	this.getUsers(function(users) {

		for (var i = 0, len = users.length; i < len; i++) {
			var user = users[i];
			if (user.username === username) {
				return cb(null, user);
			}
		}
		return cb(null, null);
	});

}


Users.prototype.checkPassword = function(password, hash) {
	return bcrypt.compareSync(password, hash);
}


module.exports = (new Users());
