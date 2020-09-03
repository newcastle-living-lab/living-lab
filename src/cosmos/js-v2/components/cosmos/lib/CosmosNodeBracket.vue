<template>

	<v-group :config="groupConfig">
		<v-shape :config="lineConfig" />
		<v-rect :config="rectConfig" />
		<v-text :config="labelConfig" />
		<v-text :config="descriptionConfig" />
	</v-group>

</template>

<script>

import colours from 'colors.css';

export default {

	name: 'CosmosNodeBracket',

	props: {
		options: Object,
		config: Object,
	},

	data() {
		return {
			height: 65,
			fontSize: 25,
			lineHeight: 1.3,
			radius: 15,
		}
	},

	computed: {

		groupConfig() {
			return {
				x: this.config.x,
				y: this.config.y,
				visible: typeof(this.config.visible) !== 'undefined' ? this.config.visible : true,
			}
		},

		lineConfig() {

			var points = {
				start: { x: 0, y: 0 },
				leftCtl: { x: 0, y: 0 + this.height },
				rightCtl: { x: this.config.width, y: 0 + this.height },
				end: { x: this.config.width, y: 0 },
			};

			var config = {
				sceneFunc: (ctx, shape) => {
					ctx.beginPath();
					ctx.moveTo(points.start.x, points.start.y);
					ctx.lineTo(points.leftCtl.x, points.leftCtl.y - this.radius);
					ctx.quadraticCurveTo(
						points.leftCtl.x,
						points.leftCtl.y,
						points.leftCtl.x + this.radius,
						points.leftCtl.y
					);
					ctx.moveTo(points.leftCtl.x + this.radius, points.leftCtl.y);
					ctx.lineTo(points.rightCtl.x - this.radius, points.rightCtl.y);
					ctx.quadraticCurveTo(
						points.rightCtl.x,
						points.rightCtl.y,
						points.rightCtl.x,
						points.rightCtl.y - this.radius
					);
					ctx.moveTo(points.rightCtl.x, points.rightCtl.y - this.radius);
					ctx.lineTo(points.end.x, points.end.y);
					ctx.closePath();
					ctx.fillStrokeShape(shape);
				},
				stroke: this.config.lineColour ? this.config.lineColour : colours.black,
				strokeWidth: 2,
				lineCap: 'round',
				lineJoin: 'round'
			};

			switch (this.config.position) {
				case 'below':
					config.scaleY = 1;
				break;
				case 'above':
					config.scaleY = -1;
				break;
			}

			return config;
		},

		rectConfig() {

			var config = {
				fill: '#ffffff',
			};

			config.width = Math.ceil(this.config.width / 3) + 20;
			config.height = (this.fontSize * this.lineHeight) + 20;

			config.x = Math.ceil((this.config.width / 2) - (config.width/2));

			switch (this.config.position) {
				case 'below':
					config.y = this.height - (config.height / 2);
				break;
				case 'above':
					config.y = -this.height - (config.height / 2);
				break;
			}

			return config;
		},

		labelConfig() {

			var config = {
				text: this.config.label,
				fontSize: this.fontSize,
				// fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: this.lineHeight,
				padding: 0,
				align: 'center',
				verticalAlign: 'middle',
				wrap: 'char',
				fill: this.config.labelColour ? this.config.labelColour : colours.black,
			};

			var w = Math.ceil(this.config.width / 2);
			config.width = w;

			config.x = Math.ceil((this.config.width / 2) - (w/2));
			config.y = 0;

			switch (this.config.position) {
				case 'below':
					config.y = this.height - ((this.fontSize * this.lineHeight) / 2)
				break;
				case 'above':
					config.y = -this.height - ((this.fontSize * this.lineHeight) / 2);
				break;
			}

			return config;
		},

		descriptionConfig() {

			var config = {
				visible: (this.config.description && this.config.description.length > 0) ? true : false,
				text: this.config.description,
				fontSize: this.fontSize * 0.6,
				fontFamily: this.options.fontFamily,
				lineHeight: this.lineHeight,
				padding: 0,
				align: 'center',
				verticalAlign: 'middle',
				wrap: 'word',
				fill: this.config.labelColour ? this.config.labelColour : colours.black,
			};

			var padding = 75;

			config.width = this.config.width - padding;
			config.x = 0 + (padding / 2);


			switch (this.config.position) {
				case 'below':
					config.y = this.height - ((config.fontSize * this.lineHeight) / 2)
				break;
				case 'above':
					config.y = -this.height + (this.fontSize * this.lineHeight/2);
				break;
			}

			return config;
		}

	}

}
</script>
