(function(window, document, $) {

	var $document = $(document);

	var $widget,
		$views,
		$projectName,
		$btnStart,
		$btnPrev,
		$btnNext;

	var projectSlug,
		projectName,
		viewName;


	var USEIO = true;
	var socket;
	// URL
	var serverurl = 'http://' + window.location.hostname + ':' + window.location.port,
	serverurl = serverurl.replace(/:$/, '');
	//array of playent event objects
	var playentevents = [];
	// array of present event objects/data
	var presentEvents = [];
	// "active" index of presentEvents
	var activeIdx = -1;
	// snapshots of object states at start and end of each presentevent
	var snapshots;
	// Project info
	var screenwidth, screenheight, txscale;
	var peinfo;

	//

	function init(event) {
		findElements();
		loadProject();
	}

	$document.ready(init);

	//

	function findElements() {

		$widget = $("[data-player]");
		$views = $widget.find("[data-ui='views']");
		$projectName = $widget.find("[data-ui='projectName']");
		$btnStart = $widget.find("[data-ui='btnStart']");
		$btnPrev = $widget.find("[data-ui='btnPrev']");
		$btnNext = $widget.find("[data-ui='btnNext']");

		$btnStart.on("click", goStartEvent);
		$btnPrev.on("click", goPrevEvent);
		$btnNext.on("click", goNextEvent);

		projectSlug = $widget.data("player");
		projectName = $widget.data("projectname");
		viewName = $widget.data("view");
	}


	function loadProject() {

		if ($widget.length != 1) {
			console.warn("Could not find player widget element");
			return;
		}

		$.getJSON(serverurl + "/player/" + projectSlug + ".json")
			.fail(function(jqxhr, textStatus, error) {
				var res = jqxhr.responseJSON;
				if (res.errors && res.errors.length > 0) {
					alert(res.errors.join(" "));
				}
			})
			.done(function(res) {
				peinfo = res.data;
				initSocket();
				initProject();
			})
			.always(function() {
				// Remove loading UI
				$("[data-ui='loading']").remove();
			});
	}


	function initSocket() {
		if (USEIO) {
			socket = io(serverurl);
			socket.on('updateEvents', function(respdata) {
				ioUpdate(respdata);
			});
		}
	}


	/**
	 * Get vars and parse the events/views
	 *
	 */
	function initProject() {

		// Gather data
		screenwidth = peinfo.screenwidth;
		screenheight = peinfo.screenheight;
		txscale = peinfo.txscale;
		var evlists = peinfo.pestates;
		snapshots = peinfo.layersnapshots;

		// get views from first entry
		if (evlists.length > 0) {

			var pestate = evlists[0];
			var peviews = pestate.peviews;

			for (var vi = 0; vi < peviews.length; vi++) {
				// Create UI element for view
				makeView(peviews[vi].viewstate);
				// views.push(view);
			}

			for (var pei = 0; pei < evlists.length; pei++) {
				presentEvents.push(evlists[pei]);
			}
		}

		// Only do these on view pages:
		if (viewName && viewName.length > 0) {

			// Update window/document title
			var screenLabel = viewName + "";
			if (screenLabel.match(/:/)) {
				var items = screenLabel.split(":");
				screenLabel = items[items.length-1];
			}
			document.title = screenLabel + " | " + projectName + " | Living Lab";

			// Update & show Widget UI
			$projectName.text(projectName);
			$widget.fadeIn("fast");

			// Toggle widget on double-click of page
			$("body").on("dblclick", function() {
				$widget.toggle();
			});
		}


	}


	/**
	 * Create the HTML element for each view link
	 *
	 */
	function makeView(state) {

		// If we don't have a views container, don't render them
		if ($views.length != 1) {
			return;
		}

		/*
		Template:
		<li class="pure-menu-item">
			<a class="pure-menu-link" href="#" target='_blank'>
				<span class="menu-item-icon"><i class="fa fa-lg fa-desktop"></i></span>
				<span class="menu-item-title">view0</span>
			</a>
		</li>
		*/

		var $icon = $("<i class='fa fa-lg fa-desktop'></i>");
		var $iconEl = $("<span>").addClass("menu-item-icon").html($icon);
		var $nameEl = $("<span>").addClass("menu-item-title").text(state.name);

		var $linkEl = $("<a>");
		$linkEl.attr({
			"href": serverurl + "/player/" + project.slug + "/" + state.name,
			"target": "_blank",
			"data-view": state.name,
			"class": "pure-menu-link"
		});

		$itemEl = $("<li>").addClass("pure-menu-item");

		$iconEl.appendTo($linkEl);
		$nameEl.appendTo($linkEl);
		$linkEl.appendTo($itemEl);
		$itemEl.appendTo($views);

		console.log("Created element for view '" + state.name + "'.");
	}


	function playEventIdx(idx) {

		console.log("Playing event index " + idx + ": " + presentEvents[idx].name);

		txstartStatetoScreens(idx);

		setTimeout(function() {
			txplayEventtoScreens(idx);
		}, 200);

		var msg = {
			view: viewName,
			project: projectSlug,
			command: 'newEventIdx',
			newEventIdx: idx
		};
		socket.emit("updateEvents", JSON.stringify(msg));

		activeIdx = idx;
	}


	function goPrevEvent() {
		var newIdx = activeIdx - 1;
		if (newIdx < 0) {
			newIdx = 0;
		}
		playEventIdx(newIdx);
	}


	function goNextEvent() {
		var newIdx = activeIdx + 1;
		if (newIdx == presentEvents.length) {
			newIdx = 0;
		}
		playEventIdx(newIdx);
	}


	function goStartEvent() {
		playEventIdx(0);
	}


	function txplayEventtoScreens(idx) {
		var pevstate = presentEvents[idx];
		for (var pei = 0; pei < pevstate.peviews.length; pei++) {
			var peview = pevstate.peviews[pei];
			var scrname = "player:" + projectSlug + ":" + peview.viewstate.name;
			var layerid = peview.layerid;
			if (layerid != 'none' && peview.actions.length > 0) {
				var scrcommand = {
					view: scrname,
					scrtxmsg: {
						command: 'play',
						info: ''
					}
				};
				var scrjson = JSON.stringify(scrcommand);
				socket.emit('screenmsg', scrjson);
			}
		}
	}

	function txstartEventtoScreens(peobj) {
		//message to screens to go to startstate
		var ind = playentevents.indexOf(peobj);
		//message to screen to go to startstate
		var pevstate = peobj.getAttr('state');
		for (var pei = 0; pei < pevstate.peviews.length; pei++) {
			var peview = pevstate.peviews[pei];
			var scrname = "player:" + projectSlug + ":" + peview.viewstate.name;
			var layerid = peview.layerid;
			if (layerid != 'none' && peview.actions.length > 0) {
				var scrcommand = {
					view: scrname,
					scrtxmsg: {
						command: 'start',
						info: ''
					}
				};
				var scrjson = JSON.stringify(scrcommand);
				socket.emit('screenmsg', scrjson);
			}
		}
	}


	/**
	 * Find a layer in a snapshot list
	 *
	 */
	function findPeviewLayer(layerid, snapshotlayers) {
		var found = false;
		var i = 0;
		var index = -1;
		while (found == false && i < snapshotlayers.length) {
			if (layerid == snapshotlayers[i].layerid) {
				found = true;
				index = i;
			}
			i = i + 1;
		}
		return index;
	}


	function txstartStatetoScreens(idx) {
		var pevstate = presentEvents[idx];
		var snapstate = snapshots[idx];

		for (var pei = 0; pei < pevstate.peviews.length; pei++) {
			var peview = pevstate.peviews[pei];
			var scrname = "player:" + projectSlug + ":" + peview.viewstate.name;
			var layerid = peview.layerid;
			//console.log(layerid);
			if (layerid != 'none') {

				layerind = findPeviewLayer(layerid, snapstate);

				var screenstate = {
					screenwidth: screenwidth,
					screenheight: screenheight,
					txscale: txscale,
					viewstate: peview.viewstate,
					layerchildren: snapstate[layerind].objstates,
					layeractions: snapstate[layerind].layeractions
				};

				var scrcommand = {
					view: scrname,
					scrtxmsg: {
						command: 'update',
						info: screenstate
					}
				};
				//console.log(scrcommand);
				var scrjson = JSON.stringify(scrcommand);
				socket.emit('screenmsg', scrjson);
			}
		}
	}


	function txClickEvent(eventId) {
		var eventIdx = findEventById(eventId);
		playEventIdx(eventIdx);
	}


	function findEventById(eventId) {
		var found = false;
		var i = 0;
		var index = -1;
		while (found == false && i < presentEvents.length) {
			if (eventId == presentEvents[i].id) {
				found = true;
				index = i;
			}
			i = i + 1;
		}
		return index;
	}


	function ioUpdate(respdata) {
		var viewcommand = JSON.parse(respdata);
		var command = viewcommand.command;

		switch (command) {
			case "clickEvent":
				// Parse viewName
				if (viewcommand.project && viewcommand.project == projectSlug) {
					txClickEvent(viewcommand.info);
				}
			break;

			case "newEventIdx":
				if (viewcommand.project == projectSlug) {
					// It's us!
					console.log("Updating local active index to " + viewcommand.newEventIdx + " from other screen " + viewcommand.view);
					activeIdx = viewcommand.newEventIdx;
				}
			break;
		}

	}


})(window, document, jQuery);
