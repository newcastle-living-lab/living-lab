function ProjectBrowser(container, items) {

	this.icons = {
		folder: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
		project: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>',
		delete: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
	};

	this.orphanLabel = '(No folder)';

	this.container = $(container);
	this.folders = [];
	this.projectsById = {};
	this.setItems(items);
	this.render();

	this.container.on('mouseover', '[data-ui="project"]', $.proxy(this, 'onProjectMouseover'));
	this.container.on('mouseout', '[data-ui="project"]', $.proxy(this, 'onProjectMouseout'));
	this.container.on('click', '[data-ui="project"]', $.proxy(this, 'onProjectClick'));
	this.container.on('click', '[data-ui="delete"]', $.proxy(this, 'onProjectDeleteClick'));

}


ProjectBrowser.prototype.addToFolder = function(name, item) {
	for (var i = 0; i < this.folders.length; i++) {
		if (this.folders[i].name == name) {
			this.folders[i].items.push(item);
			return;
		}
	}

	this.folders.push({
		name: name,
		items: [item]
	});

	return;
}


ProjectBrowser.prototype.setItems = function(items) {

	this.folders = [];
	this.projectsById = {};
	var item = {};

	for (var i = 0; i < items.length; i++) {

		item = items[i];
		if (item.folder === null) {
			item.folder = this.orphanLabel;
		}

		this.addToFolder(item.folder, item);
		this.projectsById[ item.id.toString() ] = item;
	}

	console.log(this);

	return this;
}


ProjectBrowser.prototype.render = function() {

	this.container.empty();

	for (var i = 0; i < this.folders.length; i++) {
		this.container.append(this.renderFolder(i));
	}

}

ProjectBrowser.prototype.renderFolder = function(index) {

	var folder = this.folders[index];

	// Main element for the folder
	var el = $('<div class="accordion pb-folder">');

	// Checkbox input for accordion
	var input = $('<input>').attr({
		id: 'accordion_' + index,
		type: 'checkbox',
		name: 'folders-accordion',
		checked: (folder.name === this.orphanLabel),
		hidden: true
	});

	// Label
	//
	var label = $('<label>').attr({
		class: 'accordion-header pb-header',
		for: 'accordion_' + index,
	});
	var name = $('<span class="pb-header-title">').text(folder.name);
	label.append($(this.icons.folder));
	label.append(name);

	// Body
	//
	var body = $('<div class="accordion-body pb-items">');
	var menu = $('<ul class="menu">');

	for (var i = 0; i < folder.items.length; i++) {
		menu.append(this.renderProject(folder.items[i]));
	}

	body.append(menu);

	el.append(input).append(label).append(body);

	return el;
}


ProjectBrowser.prototype.renderProject = function(project) {

	var projectId = project.id.toString(),
		projname = project.name;

	var li = $('<li class="menu-item">');
	var a = $('<a href="javascript:;">');

	a.attr('data-ui', 'project');
	a.attr('data-projectid', projectId);

	var label = $('<span class="menu-item-name">').text(projname);
	var removeBtn = $('<button class="pb-delete" type="button" data-ui="delete">').attr('data-projectid', projectId).html(this.icons.delete);

	a.append(label).append(removeBtn);

	li.append(a);
	return li;
}


/**
 * Show project details on mouseover
 *
 */
ProjectBrowser.prototype.onProjectMouseover = function(evt) {

	var projectId = $(evt.currentTarget).data('projectid').toString();
	var project = this.projectsById[projectId];

	if ( ! project) {
		return;
	}

	$("#proptable").empty();

	$("#proptable").append('<tr><td class="tablekey">id</td><td class="tableval" style="text-align:left">' + project.id + '</td></tr>');
	$("#proptable").append('<tr><td class="tablekey">name</td><td class="tableval" style="text-align:left">' + project.name + '</td></tr>');
	$("#proptable").append('<tr><td class="tablekey">creator</td><td class="tableval" style="text-align:left">' + project.creator + '</td></tr>');
	$("#proptable").append('<tr><td class="tablekey">created</td><td class="tableval" style="text-align:left">' + project.createdate + '</td></tr>');
	$("#proptable").append('<tr><td class="tablekey">saved</td><td class="tableval" style="text-align:left">' + project.lastdate + '</td></tr>');
}


/**
 * Remove details on mouseout
 *
 */
ProjectBrowser.prototype.onProjectMouseout = function(evt) {
	$('#proptable').empty();
}


ProjectBrowser.prototype.onProjectClick = function(evt) {
	var projectId = $(evt.currentTarget).data('projectid').toString();
	openProject(projectId);
}


ProjectBrowser.prototype.onProjectDeleteClick = function(evt) {

	evt.stopImmediatePropagation();

	var projectId = $(evt.currentTarget).data('projectid').toString();
	var project = this.projectsById[projectId];

	if ( ! project) {
		return;
	}

	var ans = confirm('Are you sure you want to delete the project ' + project.name + '?');
	if (ans === false) {
		return;
	}

	var self = this;

	$.ajax({
		url: hostaddr + "/removeproject",
		type: "GET",
		data: { id: projectId }
	}).done(function() {
		loadProjects();
	}).fail(function() {
		alert("Error deleting project.");
	}).always(function() {
		//alert( "complete" );
	});
}
