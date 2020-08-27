<template>

	<v-group ref="group" :config="groupConfig">
		<v-shape :config="curveConfig" />
	</v-group>

</template>

<script>

import colours from 'colors.css';

export default {

	name: 'CosmosCurve',

	props: {
		options: Object,
		config: Object,
	},

	computed: {

		groupConfig() {
			return {
				x: this.config.x,
				y: this.config.y
			};
		},

		curveConfig() {

			let pts = {
				st: [this.config.points.start.x, this.config.points.start.y],
				ct: [
					this.config.points.end.x,
					this.config.points.end.y * this.config.ratio,
					this.config.points.end.x,
					this.config.points.end.y
				],
				en: [this.config.points.end.x, this.config.points.end.y]
			};

			return {
				x: 0,
				y: 0,
				stroke: colours.olive,
				strokeWidth: 2,
				lineCap: 'round',
				dash: [9, 6],
				sceneFunc: function(context) {
					context.beginPath();
					context.moveTo(...pts.st);
					context.bezierCurveTo(...pts.ct,...pts.en);
					context.strokeShape(this);
				}
			}
		}

	}

}
</script>
