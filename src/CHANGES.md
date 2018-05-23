# Living Lab Changelog


## v1.6.0

* Added ability to permit only a single instance of the Design Screen to be loaded.

### Single instance

The `config/config.json` file **must** be updated with the `single_instance` boolean property
to specify whether the single instance feature should be enabled or not (see `config.example.json`).

When enabled, only one Design Screen page can be opened at the same time. If more than one
page is opened, subsequent Design Screen pages will display an error message and the page
will not work. Subsequent screens also disconnect from the websocket server to prevent it
from sending and processing further messages.



## v1.5.0

* Added scrollbar to side of Present screen for when content gets longer than the browser window height.
* Added page titles to all pages.


## v1.4.1

* Fixed issue with 'null' prefix when launching screen names from dashboard.


## v1.4.0

* Added logos to footer area.


## v1.3.0

* Added an autosave feature to the Design screen.
* Fixed size limit of project data when saving.

### Autosave

The `config/config.json` file **must** be updated with the `auto_save` boolean property
to specify whether the autosave feature should be enabled or not (see `config.example.json`).

When enabled, any open project in the Design screen will be automatically saved when
either 1) the page is hidden (e.g. the tab is no longer active) or 2) no user activity is
detected for two seconds.


## v1.2.1

* Fixed problem when using Project > Save or Project > Save Playlist.
* Updated port number references to better handle port 80 usage.


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
