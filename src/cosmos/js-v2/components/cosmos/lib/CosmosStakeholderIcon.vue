<template>

	<v-group ref="group">

		<v-rect :config="backgroundConfig" />

		<v-group v-if="type == 'user'" :config="groupConfig">
			<v-path ref="user" :config="user" />
		</v-group>

		<v-group v-if="type == 'organisation'" :config="groupConfig">
			<v-path :config="group[0]" />
			<v-path :config="group[1]" />
			<v-path :config="group[2]" />
			<v-path :config="group[3]" />
			<v-path :config="group[4]" />
		</v-group>

		<v-group v-if="type == 'service'" :config="groupConfig">
			<v-rect :config="serviceOutline" />
			<v-path :config="group[0]" />
			<v-path :config="group[1]" />
			<v-path :config="group[2]" />
			<v-path :config="group[3]" />
			<v-path :config="group[4]" />
		</v-group>

	</v-group>

</template>

<script>

let Icons = {};

Icons.Male = 'M 50 24.957 C 43.67 24.957 38.522 19.808 38.522 13.478 C 38.522 7.149 43.67 2 50 2 C 56.33 2 61.478 7.149 61.478 13.478 C 61.478 19.808 56.33 24.957 50 24.957 Z  M 60.435 27.043 L 39.565 27.043 C 33.229 27.05 28.094 32.185 28.087 38.522 L 28.087 64.609 C 28.087 66.913 29.959 68.783 32.261 68.783 C 34.563 68.783 36.435 66.913 36.435 64.609 L 36.435 44.722 C 36.435 44.157 36.913 43.679 37.478 43.679 C 38.044 43.679 38.522 44.157 38.522 44.722 L 38.522 92.365 C 38.522 95.629 40.264 98 43.53 98 C 46.623 98 48.957 95.577 48.957 92.365 L 48.957 65.565 C 48.957 64.988 49.424 64.521 50 64.521 C 50.576 64.521 51.043 64.988 51.043 65.565 L 51.043 92.975 C 51.052 92.987 51.069 92.995 51.077 93.008 C 51.363 95.894 53.585 98 56.47 98 C 59.734 98 61.478 95.629 61.478 92.365 L 61.478 45.085 C 61.478 44.52 61.956 44.042 62.522 44.042 C 63.087 44.042 63.565 44.52 63.565 45.085 L 63.565 64.609 C 63.565 66.913 65.437 68.783 67.739 68.783 C 70.041 68.783 71.913 66.913 71.913 64.609 L 71.913 38.522 C 71.913 32.192 66.765 27.043 60.435 27.043 Z';

Icons.Female = 'M 49.801 1.32 C 43.403 1.32 38.16 6.563 38.16 12.961 C 38.16 19.359 43.403 24.602 49.801 24.602 C 56.201 24.602 61.442 19.359 61.442 12.961 C 61.442 6.563 56.201 1.32 49.801 1.32 Z  M 50 26.784 C 37.036 26.784 31.688 37.201 30.488 41.6 C 30.488 41.6 26.189 57.061 26.189 57.277 C 24.758 60.995 27.785 65.393 31.481 65.939 L 38.689 42.393 C 38.706 42.336 38.732 42.245 38.757 42.196 C 38.926 41.837 39.285 41.605 39.682 41.6 C 40.268 41.6 40.74 42.072 40.74 42.658 C 40.74 42.742 40.692 42.84 40.675 42.922 L 32.141 70.306 C 31.927 70.941 32.101 71.586 32.405 72.223 C 32.829 72.858 33.415 73.282 34.257 73.282 L 65.741 73.282 C 66.585 73.282 67.171 72.858 67.595 72.223 C 67.899 71.588 68.073 70.943 67.857 70.306 L 59.327 42.922 C 59.308 42.84 59.26 42.74 59.26 42.658 C 59.26 42.072 59.732 41.6 60.318 41.6 C 60.716 41.604 61.076 41.836 61.245 42.196 C 61.271 42.26 61.292 42.326 61.309 42.393 L 68.519 65.939 C 72.215 65.393 75.242 60.995 73.811 57.277 C 73.811 57.061 69.512 41.6 69.512 41.6 C 68.312 37.201 62.964 26.784 50 26.784 Z  M 40.476 75.398 L 40.476 94.447 C 40.476 96.779 42.376 98.68 44.709 98.68 C 47.041 98.68 48.942 96.779 48.942 94.447 L 48.942 75.398 L 40.476 75.398 Z  M 51.058 75.398 L 51.058 94.447 C 51.058 96.779 52.959 98.68 55.291 98.68 C 57.624 98.68 59.524 96.779 59.524 94.447 L 59.524 75.398 L 51.058 75.398 Z';

export default {

	props: {
		colour: {
			type: String,
			default: '#cccccc',
		},
		type: {
			type: String,
			default: 'user',
		},
		size: {
			type: Number,
			default: 1,
		},
		width: {
			type: Number,
			default: 100,
		},
		x: Number,
		y: Number,
	},

	computed: {

		backgroundConfig() {
			return {
				fill: '#ffffff',
				x: 0,
				y: 0,
				width: this.width,
				height: this.size + 20
			}
		},

		user() {
			var xStart = 0,
				yStart = 10;

			return {
				closed: true,
				x: (this.width - this.size) / 2,
				y: yStart + 0,
				fill: this.colour,
				data: Icons.Male,
				strokeWidth: 0,
				opacity: 1,
				scale: {
					x: this.size / 100,
					y: this.size / 100,
				}
			};
		},

		groupConfig() {
			return {
				x: this.x,
				y: this.y,
			}
		},

		group() {

			let parts = [];

			var xStart = 0,
				yStart = 10;

			parts.push({
				closed: true,
				x: xStart + 0,
				y: yStart + 20,
				fill: this.colour,
				data: Icons.Male,
				strokeWidth: 0,
				scale: {
					x: 0.5,
					y: 0.5,
				},
				opacity: 0.8,
			});

			parts.push({
				closed: true,
				x: xStart + 24,
				y: yStart + 0,
				fill: this.colour,
				data: Icons.Female,
				strokeWidth: 0,
				scale: {
					x: 0.4,
					y: 0.4,
				},
				opacity: 1,
			});

			parts.push({
				closed: true,
				x: xStart + 36,
				y: yStart + 10,
				fill: this.colour,
				data: Icons.Male,
				strokeWidth: 0,
				scale: {
					x: 0.5,
					y: 0.5,
				},
				opacity: 0.6,
			});

			parts.push({
				closed: true,
				x: xStart + 60,
				y: yStart + 30,
				fill: this.colour,
				data: Icons.Female,
				strokeWidth: 0,
				scale: {
					x: 0.4,
					y: 0.4,
				},
				opacity: 1,
			});

			parts.push({
				closed: true,
				x: xStart + 62,
				y: yStart + 0,
				fill: this.colour,
				data: Icons.Male,
				strokeWidth: 0,
				scale: {
					x: 0.3,
					y: 0.3,
				},
				opacity: 0.8,
			});

			return parts;
		},


		serviceOutline() {

			let pos = {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
			};

			return {
				x: 0,
				y: 0,
				width: 100,
				height: this.size + 20,
				stroke: this.colour,
				strokeWidth: 1,
				dash: [6, 4]
			}
		}

	}

}
</script>
