# Living Lab Changelog


## v1.2.0

This version includes a number of changes to the way the project is structured as well as
several new features.

* Added `package.json` for dependencies and scripts.
* Added simple authentication using `Passport`.
* Updated the project folder structure to be better organised.
* Added `Express` as the web server.
* Added provisional support for _separate_ SocketIO web server.
* Added config file (`config/config.json`).
* Updated several pages with a design refresh.
* Added `Gulp` for processing frontend CSS assets.
* Added Screen Identification feature to dashboard.
* Branding and documentation updates.
* Added Changelog page to show this file.

### package.json

Dependencies for the project are now specified here. Run `npm install --production` to
install them.

It is now possible to run `npm start` to run the main Living Lab Node server, which is a
shortcut for running `node server.js`.

### Authentication

Simple username/password authentication has been added with the support of `Passport`.

This is optional, and can be turned on or off by setting the config property `require_auth`
in `config.json`.

Users are configured in `config/users.json`. Copy `config/users.example.json` to
`config/users.json` and adjust accordingly. User passwords will be securely hashed when
the Node server is restarted.

### Updated project folder structure

`nodeio.js` has been renamed to `server.js`.

`data`: Runtime and user-supplied data and files are now in the `data` folder:

```
|-- data
    |-- playlists
    |-- resources
    |-- livlab.sqlite
```

`config`: This folder contains the config files for the project. Example files included.

`public`: This folder is for static files served by `Express`.

### Added `Express` as the web server

The main pages are now handled as Routes in Express, rather than being static files. Any
bookmarked URLs to the pages will no longer work - the base name is the same - just remove
the `.html` suffix.

E.g. `/present.html` is now located at `/present`.

### Introduced config.json file

The `config/config.json` file stores several parameters for running the project.

- `db_path` Path to the SQLite database file, relative to the project root (server.js)
- `http_port` The TCP port number to run the main web server on.
- `socket_port` The TCP port number to run the SocketIO web server on.
	If this is the same as `http_port`, then SocketIO will be attached to the `Express`
	server. This is recommended - the separation isn't fully supported on all pages yet.
- `require_auth`: Specify whether to use and require authentication (`config/users.json`)
- `secret`: If using authentication, this secret is used by `Passport` for sessions.

### Design refresh and Gulp

The design for the homepage and playlists file has been updated with new branding.

`Gulp` is used to process the LESS stylesheets into minified CSS. The `gulpfile.js` file
describes the tasks.

The built CSS files are included, but if they need to be built, ensure the devDependencies
are installed, then run `gulp`.

### Screen Identification

When each screen page is loaded, the name is displayed for about five seconds.

The _Identify Screens_ button on the dashboard page will instruct all open screens to show
this message again.
