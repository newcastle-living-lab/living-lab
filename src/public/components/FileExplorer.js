function FileExplorer(container, hostaddr) {

	this.container = $(container);
	this.document = $(document);
	this.hostaddr = hostaddr;

	this.nodes = [];
	this.currentPath = null;

	this.container.on('click', '[data-ui="item"][data-type="directory"]', $.proxy(this, 'onFolderClick'));
	this.container.on('click', '[data-ui="item"][data-type="file"]', $.proxy(this, 'onFileClick'));

	this.document.on('fx:deleted', $.proxy(this, 'onFileDeleted'));
	this.document.on('fx:uploaded', $.proxy(this, 'onFileUploaded'));

	this.loadResources('/');
}


FileExplorer.prototype.trigger = function(event, data) {
	this.document.trigger("fx:" + event, data);
}


/**
 * Make server request to get the resources.
 * Optionally navigate to the given `path` after they have been loaded.
 *
 */
FileExplorer.prototype.loadResources = function(path) {

	this.trigger('load_start');
	this.container.empty();

	$.getJSON(this.hostaddr + "/getresources", $.proxy(function(data) {

		this.nodes = data;
		this.trigger('load_finish');
		this.navigate(path);

	}, this));

}


/**
 * When a file is uploaded, re-load the resources and re-navigate to last folder.
 *
 */
FileExplorer.prototype.onFileUploaded = function(evt) {
	this.loadResources(this.currentPath);
}

/**
 * When a file is deleted, re-load the resources and re-navigate to last folder.
 *
 */
FileExplorer.prototype.onFileDeleted = function(evt) {
	this.loadResources(this.currentPath);
}


/**
 * On clicking a folder, navigate to it to refresh the file list.
 *
 */
FileExplorer.prototype.onFolderClick = function(evt) {
	var id = $(evt.currentTarget).data('id');
	this.navigate(id);
}


/**
 * Trigger an event to announce a file is selected.
 *
 */
FileExplorer.prototype.onFileClick = function(evt) {
	var el = $(evt.currentTarget);
	el.addClass('isactive');
	el.siblings().removeClass('isactive');
	this.trigger('select', el.data());
}


/**
 * Go to a specific folder and render the items
 *
 */
FileExplorer.prototype.navigate = function(path) {

	if ( ! path || path === undefined || path === null) {
		path = '/';
	}

	this.currentPath = path;

	var files = this.getFilesForPath(path);

	this.container.empty();
	for (var i in files) {
		this.container.append(this.renderFile(files[i]));
	}

	this.trigger('navigate', path);
}


/**
 * Render a file/folder item.
 *
 */
FileExplorer.prototype.renderFile = function(file) {

	var item = $('<a>', {
		'class': 'resourceicon',
		'href': 'javascript:;',
		'data-id': file.id,
		'data-name': file.name,
		'data-filename': "resources" + file.path,
		'data-path': file.path,
		'data-type': file.type,
		'data-ui': 'item',
	});

	var img = $("<span>", { "class": "resourceimg" });
	img.css('background-image', 'url("' + this.getFileIcon(file) + '")');

	var label = $('<span>', { class: 'resourcename' }).text(file.name);

	item.append(img);
	item.append(label);
	return item;
}


/**
 * Get the icon for the file based on type.
 *
 */
FileExplorer.prototype.getFileIcon = function(file) {

	var src = 'none';

	switch (file.type) {

		case 'directory':

			if (file.parent === null) {
				src = '/images/folder-back.png';
			} else {
				src = '/images/folder.png';
			}

		break;

		case 'file':

			if (file.name.match(/\.(mp3|wav)$/)) {
				src = '/images/audio.png';
			} else {
				src = encodeURI('resources' + file.path);
			}

		break;

	}

	return src;
}


/**
 * Get the sorted file listing for a given path.
 *
 * @return []
 *
 */
FileExplorer.prototype.getFilesForPath = function(path) {

	// Get initial listing where node.parent == path
	var dirListing = $.map(this.nodes, function(node) {
		return (node.parent == path ? node : null);
	});

	// get parent of node.id==path for "back" navigation
	if (path !== '/') {
		for (var i in this.nodes) {
			if (this.nodes[i].id === path) {
				dirListing.push({
					parent: null,
					id: this.nodes[i].parent,
					name: "Back",
					type: 'directory',
				});
				break;
			}
		}
	}

	// Sort the items in this dir according to "back" > folders > files (alphabetical).

	dirListing.sort(function(a, b) {

		if (a.parent === null) return -1;

		if (a.type == 'directory' && b.type == 'file') return -1;

		if (a.type == 'file' && b.type == 'file') {
			var nameA = a.name.toUpperCase();
  			var nameB = b.name.toUpperCase();
  			if (nameA < nameB) return -1;
  			if (nameA > nameB) return 1;
  		}

  		return 0;
	});

	return dirListing;
}
