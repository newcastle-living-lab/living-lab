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
		useSessionStorage: true,
		parseUrl: true
	};

	this.options = $.extend(defaults, options);
}


Settings.prototype.setupValues = function(values) {
	for (var property in values) {
		if (values.hasOwnProperty(property)) {
			this.setQuietly(property, values[property]);
		}
	}
}


Settings.prototype.loadValues = function() {

	// Load from sessionstroage
	for (var property in this.store) {

		if (this.options.useSessionStorage && sessionStorage.getItem(property)) {
			this.setQuietly(property, sessionStorage.getItem(property));
		}

		if (this.options.parseUrl && this.urlParams.has(property)) {
			this.setQuietly(property, this.urlParams.get(property));
		}
	}

	this.persistStore();
}


Settings.prototype.get = function(key, defaultValue) {
	if (this.store.hasOwnProperty(key)) {
		return this.store[key];
	}
	return defaultValue;
}

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


Settings.prototype.set = function(key, value) {
	this.setQuietly(key, value);
	this.persistStore();
	return this;
}


Settings.prototype.persistStore = function() {

	if ( ! this.options.useSessionStorage) {
		return;
	}

	for (var property in this.store) {
		console.log("Storing " + property + " value of " + this.store[property]);
		sessionStorage.setItem(property, this.store[property]);
	}

	return this;
}
