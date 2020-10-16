#!/usr/bin/env node

var defaultConfig = {
	db_path: null,
	http_port: 1337,
	socket_port: 1337,
	require_auth: true,
	session_driver: 'default',
	secret: null,
	auto_save: false,
	single_instance: true,
	fathom_site_id: false
};

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
	redis = require('redis'),
	redisStore = require('connect-redis')(session),
	// SQLiteStore = require('connect-sqlite3')(session),
	cookieParser = require("cookie-parser"),
	bodyParser = require("body-parser"),
	init = require("./includes/init.js"),
	database = require("./includes/database.js"),
	helpers = require("./includes/helpers.js"),
	users = require("./includes/users.js"),
	config = require("./config/config.json"),
	package = require("./package.json"),
	routes = require("./routes/index.js");

config = {...defaultConfig, ...config};

const { v4: uuidv4 } = require('uuid');

var app,
	webSocket,
	httpServer,
	socketServer;

var VERSION = package.version;

var initAuth = function() {

	passport.use(new Strategy(function(username, password, cb) {
		users.authenticate(username, password)
			.then(function(user) {
				// console.log("Got user!");
				// console.log(user);
				cb(null, user);
				return;
			})
			.catch(function(err) {
				console.error("Auth: error: " + err);
				return cb(null, false);
			});
	}));

	passport.serializeUser(function(user, cb) {
		cb(null, user.id);
	});

	passport.deserializeUser(function(id, cb) {
		users.getById(id)
			.then(function(user) {
				delete user.password;
				cb(null, user);
			})
			.catch(function() {
				cb(false);
			});
	});

}


var initServers = function() {

	app = express();
	app.use(express.static(path.join(__dirname, "public")));
	app.use("/resources", express.static(path.join(process.cwd(), "data", "resources")));
	app.use("/playlists", express.static(path.join(process.cwd(), "data", "playlists")));
	app.use("/images", express.static(path.join(process.cwd(), "data", "images")));
	app.use("/export", express.static(path.join(process.cwd(), "data", "export")));
	app.use("/cosmos-images", express.static(path.join(process.cwd(), "cosmos", "template-images")));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true, limit: 50 * 1024 * 1024 }));

	if (config.require_auth) {

		var sessionConfig = {
			name: 'livinglab',
			secret: config.secret,
			resave: false,
			saveUninitialized: false
		}

		if (config.session_driver === 'redis') {

			var redisClient = redis.createClient();
			redisClient.on('error', function(err) {
			  console.error('Redis error: ', err);
			});

			sessionConfig.genid = function(req) {
				return uuidv4();
			}
			sessionConfig.store = new redisStore({
				host: 'localhost',
				port: 6379,
				client: redisClient,
			});

		}

		app.use(session(sessionConfig));
		app.use(cookieParser());
		app.use(passport.initialize());
		app.use(passport.session());
	}

	var nunjucksEnv = nunjucks.configure(path.join(__dirname, 'views'), {
		// watch: true,
		noCache: true,
		autoescape: true,
		express: app
	});

	app.use(function(req, res, next) {

		res.locals.app_version = VERSION;
		res.locals.user = (req.user ? req.user : null);
		res.locals.require_auth = config.require_auth;
		res.locals.authenticated = (req.user);
		res.locals.auto_save = config.auto_save;
		res.locals.single_instance = config.single_instance;
		res.locals.fathom_site_id = config.fathom_site_id ? config.fathom_site_id : false;
		res.locals.userHasRole = function(role) {
			if (config.require_auth === false) {
				return true;
			}
			return helpers.userHasRole(req.user, role)
		}

		// Logo config
		var allLogos = require(path.join(process.cwd(), "config", "logos.json"));
		var hasList = (config.logos && config.logos.length);
		var logos = [];
		for (var name in allLogos) {
			var isVisible = (hasList && config.logos.indexOf(name) !== -1) || !hasList;
			if (isVisible) {
				logos.push(allLogos[name]);
			}
		}
		res.locals.logos = logos;

		next();
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

		socket.on("instance:check", function(msg) {
			ws.emit("instance:syn", msg);
		});

		socket.on("instance:ack", function(msg) {
			ws.emit("instance:ping", msg);
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
