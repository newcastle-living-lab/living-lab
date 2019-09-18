function Settings(values, options) {

	this.store = {};
	this.urlParams = new URLSearchParams(location.search);

	options = options || {};
	this.setupOptions(options);

	values = values || {};
	this.setupValues(values);

	this.loadValues();
}


Settings.prototype.setupOptions = function(options) {

	var defaults = {
		useLocalStorage: true,
		parseUrl: true,
		namespace: this.getDefaultNamespace(),
	};

	this.options = $.extend(defaults, options);
}


/**
 * Generate a default namespace for this based on page path.
 *
 */
Settings.prototype.getDefaultNamespace = function() {
	var path = window.location.pathname,
		pathparts = path.split('/'),
		name = pathparts[ pathparts.length-1 ].replace(/\.html/, '');
	return name;
}


/**
 * Set the default values as supplied via params.
 *
 */
Settings.prototype.setupValues = function(values) {
	for (var property in values) {
		if (values.hasOwnProperty(property)) {
			this.setQuietly(property, values[property]);
		}
	}
}


/**
 * Generate storage key with the configured namespace.
 *
 */
Settings.prototype.getKey = function(property) {
	return [this.options.namespace, property].join(':');
}


/**
 * Load values from localStorage followed by URL params.
 *
 */
Settings.prototype.loadValues = function() {

	// Load from sessionstroage
	for (var property in this.store) {

		var storageKey = this.getKey(property);

		if (this.options.useLocalStorage && localStorage.getItem(storageKey)) {
			this.setQuietly(property, localStorage.getItem(storageKey));
		}

		if (this.options.parseUrl && this.urlParams.has(property)) {
			this.setQuietly(property, this.urlParams.get(property));
		}
	}

	this.persistStore();
}


/**
 * Get a value from the local storge (already populated from persistent)
 *
 */
Settings.prototype.get = function(key, defaultValue) {
	if (this.store.hasOwnProperty(key)) {
		return this.store[key];
	}
	return defaultValue;
}


/**
 * Set the value locally but don't persist.
 *
 */
Settings.prototype.setQuietly = function(key, value) {

	if (value === 'true') {
		value = true;
	}

	if (value === 'false') {
		value = false;
	}

	if (value === 'null') {
		value = null;
	}

	this.store[key] = value;
	return this;
}


/**
 * Set a setting value and save it.
 *
 */
Settings.prototype.set = function(key, value) {
	this.setQuietly(key, value);
	this.persistStore();
	return this;
}


/**
 * Save the store data keys+values to storage.
 *
 */
Settings.prototype.persistStore = function() {

	if ( ! this.options.useLocalStorage) {
		return;
	}

	for (var property in this.store) {
		var storageKey = this.getKey(property);
		console.log("Storing " + storageKey + " value of " + this.store[property]);
		localStorage.setItem(storageKey, this.store[property]);
	}

	return this;
}
