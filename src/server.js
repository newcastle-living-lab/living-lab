var express = require("express"),
	io = require("socket.io"),
	http = require("http"),
	os = require("os"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	nunjucks = require("nunjucks"),
	passport = require("passport"),
	Strategy = require("passport-local").Strategy,
	session = require("express-session"),
	cookieParser = require("cookie-parser"),
	bodyParser = require("body-parser"),
	init = require("./includes/init.js"),
	database = require("./includes/database.js"),
	users = require("./includes/users.js"),
	config = require("./config/config.json"),
	routes = require("./routes/index.js");

var app,
	webSocket,
	httpServer,
	socketServer;


var initAuth = function() {

	passport.use(new Strategy(function(username, password, cb) {
		users.findByUsername(username, function(err, user) {
			if (err) { return cb(err); }
			if ( ! user) { return cb(null, false); }
			if ( ! users.checkPassword(password, user.password)) { return cb(null, false); }
			// if (user.password != password) { return cb(null, false); }
			return cb(null, user);
		});
	}));

	passport.serializeUser(function(user, cb) {
		cb(null, user.username);
	});

	passport.deserializeUser(function(id, cb) {
		users.findByUsername(id, function (err, user) {
			if (err) { return cb(err); }
			cb(null, user);
		});
	});

}


var initServers = function() {

	app = express();
	app.use(express.static(path.join(__dirname, "public")));
	app.use("/resources", express.static(path.join(__dirname, "data", "resources")));
	app.use("/playlists", express.static(path.join(__dirname, "data", "playlists")));

	if (config.require_auth) {
		app.use(session({ secret: config.secret, resave: false, saveUninitialized: false }));
		app.use(cookieParser()),
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(passport.initialize());
		app.use(passport.session());
	}

	nunjucks.configure('views', {
		autoescape: true,
		express: app
	});

	httpServer = http.Server(app);

	if (config.http_port == config.socket_port) {

		// Same server
		webSocket = io(httpServer);

	} else {

		var socketHandler = function(req, res) {};
		socketServer = http.createServer(socketHandler);
		webSocket = io(socketServer);
		socketServer.listen(config.socket_port, function() {
			console.log("Living Lab SocketIO server running on port " + config.socket_port);
		});

	}

	httpServer.listen(config.http_port, function() {
		console.log("Living Lab HTTP server running on port " + config.http_port);
	});

	initSocketEvents(webSocket);
}


var initSocketEvents = function(ws) {

	//webSocket.set('log level', 1);
	ws.on('connection', function(socket) {

		socket.on("ident:request", function() {
			ws.emit("ident:show");
		});

		socket.on('updateEvents', function(msg) {
			socket.broadcast.emit('updateEvents', msg);
			//console.log(msg);
		});

		socket.on('designmsg', function(msg) {
			socket.broadcast.emit('designmsg', msg);
			//console.log(msg);
		});

		socket.on('screenmsg', function(msg) {
			var scrmsg = JSON.parse(msg);
			//console.log(msg);
			var viewname = scrmsg.view;
			//console.log(viewname);
			var txmsg = JSON.stringify(scrmsg.scrtxmsg);
			socket.broadcast.emit(viewname, txmsg);
			//console.log(txmsg);
		});

	});
}

// Initialises dirs and database
init();

if (config.require_auth) {
	users.init();
	initAuth();
}

initServers();


routes.forEach(function(route) {
	console.log("Registering route " + route.method.toUpperCase() + " " + route.route);
	app[route.method](route.route, route.handler);
});
