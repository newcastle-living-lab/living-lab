# Living Lab Changelog


## v1.18.1

* Fixed an issue loading the events/actions when opening a Project.
* Updated logos.


## v1.18.0

* Added collapsable left column functionality to Design screen.
* Added "unsupported browser" notification.
* Updated other UI aspects of the Design screen.


## v1.17.0

* Added Layer Export/Import functionality.
* Started adding support for Audio files to Library/Design.

### Export Layers

Layers and their child objects can be exported from the Layers menu. This will produce a
block of encoded text which can be copied, pasted, saved or transported, and allows the
layer and its child objects to imported into another project.

In future releases, this functionality will be expanded to include associated events and
actions.

Exported layers can be imported into the same project, or a different project on the same
Living Lab instance.

**Note:** Importing the layer into _another Living lab instance_ may result in
inconsistencies or missing links to any local Library resources if used in the source
project.


## v1.16.1

* Fixed issues with auth, sessions, events when `require_auth` config is false.


## v1.16.0

* Added internal event logging functionality. See `events` table in the SQLite database.
* Fixed issue with removing playlists.


## v1.15.0

* Added support for [pkg](https://www.npmjs.com/package/pkg).

### Pkg support

The Living Lab project can now be built as a standalone runtime using `pkg`.

To build Living Lab, run `npm run pkg-win` or `npm run pkg-mac` from the `src` directory.
The runtimes will be built into the respective platform directories in `../pkg/`.

When installed with the Living Lab project, the sqlite3 module installs a driver for the
given platform at install-time. This can't be bundled in the `pkg` process and must be
copied manually to the pkg platform directory.

The file will be here: `src\node_modules\sqlite3\lib\binding\{platform}\node_sqlite3.node`

When the standalone Living Lab is ran, it will use `config` and `data` folders that are in
the same level as the executable. For example:

```
|-- pkg
    |-- data
    |-- config
    |-- living-lab.exe
    |-- node_sqlite3.node
```


## v1.14.1

* Added default global documentation for Player pages.


## v1.14.0

* Updated "Player" project page to inherit the global style.
* Added documentation support for Player Project page.
* Updated logos and their configuration.


### Project Player documentation

The player "project" page contains a placeholder to display documentation, controlled by
the presence of specifically-named files in Markdown format.

The following file locations are checked, in order:

- `data/doc/(project-name).md`
- `data/doc/living-lab.md`

`(project-name)` is an example, and would be replaced by the name in the URL of the player.
Do not include brackets in the document filename.

The first file found will be displayed. If none are found, no documentation will be displayed.


### Logos configuration

The footer logos are sourced from the `config/logos.json` file. This specifies the name,
image file, title and optional URL.

By default, all logos will be shown. To customise the logos that are displayed edit
the `config/config.json` file, adding the following key:

```
...
"logos": ["nclacuk", "northumbria"]
...
```

The `logos` key should be a JSON array of logo names as specified in the `logos.json` file.
In the example, only the two logos named "nclacuk" and "northumbria" would be displayed.


## v1.13.0

* Added new 'Player' feature to view projects on their own.


## v1.12.0

* Added ordering and created-date display to list of Playlists.
* Added ability to delete playlists.
* Added Headway release notes widget.


## v1.11.0

* Added project name to generated Playlists.
* Added a 'Next' button to the Design screen to cycle through clicking the event boxes in the actions panel.
* Updated screen pages so they will wait until animations are complete before starting the next.


## v1.10.2

* Fixed view screen scaling issue when window width/height is greater than project dimensions.


## v1.10.1

* Fixed an issue when using/copying Figure objects so that the scaleSize is applied immediately.


## v1.10.0

* Updated canvas so that its size is always displayed proportionally to the project's dimensions.
* Updated colours on the Design screen to be less purple.


## v1.9.1

* Fixed issue with PLaylists not playing properly (object actions)


## v1.9.0

* Updated UI on Playlist Play page.


## v1.8.0

* Replaced canvas interaction library Kinetic JS with Konva.


## v1.7.4

* Fixed play screen setup so that grouped objects can also be clickable for events, like regular objects.


## v1.7.3

* Fixed some more issues caused by deleted items.


## v1.7.2

* Fixed issue with the Actions tab contents not being generated when layer objects are missing/deleted.


## v1.7.1

* Fixed issue with playlist page to handle deleted/missing events/layers/views.


## v1.7.0

* Added functionality to Present screen so that new events inherit the view layers from the selected or previous event.


## v1.6.2

* More fixes to the issues identified and fixed in v1.6.1, particularly with saving playlists.


## v1.6.1

* Attempt at fixing the issue where some projects wouldn't load due to a javascript error.


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
