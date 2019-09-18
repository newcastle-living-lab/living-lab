function LayerStartButton(btn) {

	this.button = btn;
	this.document = $(document);
	this.layer = null;

	this.document.on('object_selected', $.proxy(this, 'onObjectSelected'));
	this.button.on('click', $.proxy(this, 'onButtonClick'));
	this.updateButton();

}


LayerStartButton.prototype.onObjectSelected = function(evt, data) {
	if (data.type == 'layer') {
		this.setLayer(data.layer);
		this.updateButton();
	}
}


LayerStartButton.prototype.onButtonClick = function(evt) {
	this.document.trigger('ui:set_layer_start');
}


LayerStartButton.prototype.setLayer = function(layer) {

	this.layer = layer;
	this.hasState = false;

	var layerstate = this.layer.getAttr('state').startstate;

	if (layerstate == null || layerstate == undefined) {
		this.hasState = false;
		return this;
	}

	try {
		var startstate = JSON.parse(layerstate);
	} catch (e) {
		this.hasState = false;
		return this;
	}

	this.hasState = true;
	return this;
}

LayerStartButton.prototype.updateButton = function() {

	if ( ! this.layer) {
		return;
	}

	if (this.hasState) {
		this.button.css({ 'background-color': '#CBF2CF' });
	} else {
		this.button.css({ 'background-color': '#FFCFCD' });
	}
}
