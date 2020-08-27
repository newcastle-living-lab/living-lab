<template>

	<v-group ref="group" :config="groupConfig">
		<v-text ref="label" :config="labelConfig" />
		<v-arrow :config="arrowConfig" />
	</v-group>

</template>

<script>

import colours from 'colors.css';

export default {

	name: 'CosmosArrow',

	props: {
		options: Object,
		config: Object,
	},

	data() {
		return {
			labelOffset: { x: 0, y: 0 }
		}
	},

	computed: {

		groupConfig() {
			return {
				x: this.config.x,
				y: this.config.y
			};
		},

		labelConfig() {

			var defaults = {
				text: '',
				x: 0,
				y: 0,
				fontSize: 18,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				fill: colours.black,
				lineHeight: 1.3,
				padding: 0,
				align: 'right',
				verticalAlign: 'middle',
				offsetX: this.labelOffset.x,
				offsetY: this.labelOffset.y,
			};

			var config = Object.assign(defaults, this.config.label);

			// var coords = this.arrowCoords;
			// config.offsetX = coords.end.x;
			// config.offsetY = coords.end.y;

			return config;
		},

		arrowConfig() {

			var width = this.config.length;

			var defaults = {
				pointerLength: 8,
				pointerWidth: 8,
				fill: colours.gray,
				stroke: colours.black,
				strokeWidth: 4
			};

			var config = Object.assign({}, defaults);

			var coords = this.arrowCoords;

			config.points = [
				coords.start.x,
				coords.start.y,
				coords.end.x,
				coords.end.y,
			];
			config.offsetX = coords.end.x;
			config.offsetY = coords.end.y;

			if (this.config.arrowColour) {
				config.fill = this.config.arrowColour;
				config.stroke = this.config.arrowColour;
			}

			return config;
		},

		arrowCoords() {

			var points = {
				start: { x: 0, y: 0},
				end: { x: 0, y: 0},
			};

			var deg = 0;

			switch (this.config.direction.toUpperCase()) {
				case "N": deg = 270; break;
				case "S": deg = 90; break;
				case "E": deg = 0; break;
				case "W": deg = 180; break;
				case "NE": deg = 315; break;
				case "SE": deg = 45; break;
				case "SW": deg = 135; break;
				case "NW": deg = 225; break;
			}

			var rad = deg * (Math.PI / 180);
			points.end.x = points.start.x + (this.config.length * Math.cos(rad));
			points.end.y = points.start.y + (this.config.length * Math.sin(rad));

			return points;
		}

	},

	methods: {
		moveLabel() {
			this.$nextTick(() => {

				if ( ! this.$refs.label) {
					return;
				}

				var w = this.$refs.label.getNode().getClientRect().width;
				var h = this.$refs.label.getNode().getClientRect().height;
				var coords = this.arrowCoords;

				switch (this.config.direction.toUpperCase()) {
					case "SE":
					case "E":
					case "NE":
						this.labelOffset.x = 5 + w + coords.end.x;
						this.labelOffset.y = (h/2) + coords.end.y;
					break;
					case "S":
						this.labelOffset.x = coords.end.x + (w/2);
						this.labelOffset.y = coords.end.y + h + 5;
					break;
					case "SW":
						this.labelOffset.x = coords.end.x + 5;
						this.labelOffset.y = coords.end.y + h + 5;
					break;
					case "W":
						this.labelOffset.x = coords.end.x - 5;
						this.labelOffset.y = (h/2) + coords.end.y;
					break;
					case "NW":
						this.labelOffset.x = coords.end.x;
						this.labelOffset.y = coords.end.y;
					break;
				}

			});
		}
	},

	mounted() {
		this.moveLabel();
	}

}
</script>
