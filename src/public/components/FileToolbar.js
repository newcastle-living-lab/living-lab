function FileToolbar(container, hostaddr) {

	this.container = $(container);
	this.document = $(document);
	this.hostaddr = hostaddr;

	this.uiPath = null;
	this.uiNewBtn = null;
	this.uiDeleteBtn = null;

	// Current path navigated to
	this.currentPath = null;
	// Path of the parent
	this.parentPath = null;
	// Number of child items in current path
	this.numItems = null;

	this.icons = {
		'new': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder-plus"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>',
		'delete': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
	};

	this.container.on('click', '[data-ui="new"]', $.proxy(this, 'onNewClick'));
	this.container.on('click', '[data-ui="delete"]', $.proxy(this, 'onDeleteClick'));

	this.document.on('fx:navigate', $.proxy(this, 'onNavigate'));

	this.render();
}


FileToolbar.prototype.onNewClick = function(evt) {

	var name = prompt('New folder name:');
	var doc = this.document;

	var path = this.currentPath;

	if (name && name.length > 0) {

		$.ajax({
			url: hostaddr + "/addresourcefolder",
			type: "POST",
			data: {
				'path': this.currentPath,
				'name': name
			}
		})
		.success(function() {
			doc.trigger('fx:folder_created', { 'path': path, 'name': name });
		})
		.fail(function() {
			alert('Error adding the folder');
		});

	}
}


FileToolbar.prototype.onDeleteClick = function(evt) {

	evt.stopImmediatePropagation();

	var ans = confirm('Are you sure you want to delete this resource folder "' + this.currentPath + '"?');

	if ( ! ans) {
		return;
	}

	var dir = this.currentPath,
		parent = this.parentPath;

	$.ajax({
		url: hostaddr + "/removeresource",
		type: "POST",
		data: {
			'dir': dir
		}
	})
	.success(function() {
		$(document).trigger('fx:folder_deleted', { 'dir': dir, 'parent': parent });
	})
	.fail(function() {
		alert('Error deleting the folder');
	});

}


FileToolbar.prototype.render = function() {

	this.uiPath = $('<div>', { 'class': 'filetoolbar-path' }).text(this.currentPath);

	var buttons = $('<div>', { 'class': 'filetoolbar-buttons' });

	this.uiNewBtn = $('<button>', {
		'class': 'filetoolbar-button btn-action-new',
		'type': 'button',
		'data-ui': 'new',
		'title': 'Create new folder here',
	}).html(this.icons.new);

	this.uiDeleteBtn = $('<button>', {
		'class': 'filetoolbar-button btn-action-delete',
		'type': 'button',
		'data-ui': 'delete',
		'title': 'Delete this folder',
	}).html(this.icons.delete);

	buttons.append(this.uiNewBtn);
	buttons.append(this.uiDeleteBtn);

	this.container.append(this.uiPath).append(buttons);
}



/**
 * Go to a specific folder and render the items
 *
 */
FileToolbar.prototype.onNavigate = function(evt, params) {

	var path = params.path;

	if ( ! path || path === undefined || path === null) {
		path = '/';
	}

	this.currentPath = path;

	this.numItems = params.files.length;

	if (params.files[0].parent == null) {
		this.parentPath = params.files[0].id;
	}

	if (params.files.length == 1 && params.files[0].parent == null) {
		this.numItems = 0;
	}

	this.updatePath(params.alias);
	this.updateButtonAvailability();
}


FileToolbar.prototype.updatePath = function(alias) {
	var text = alias && alias.length ? alias : this.currentPath;
	this.uiPath.text(text);
}

FileToolbar.prototype.updateButtonAvailability = function() {

	var isProject = this.currentPath === '/projects' || this.parentPath === '/projects';

	if (isProject) {
		this.uiNewBtn.prop('disabled', true);
	} else {
		this.uiNewBtn.prop('disabled', false);
	}

	if (this.numItems > 0 || isProject) {
		this.uiDeleteBtn.prop('disabled', true);
	} else {
		this.uiDeleteBtn.prop('disabled', false);
	}
}


FileToolbar.prototype.trigger = function(event, data) {
	this.document.trigger("ft:" + event, data);
}
