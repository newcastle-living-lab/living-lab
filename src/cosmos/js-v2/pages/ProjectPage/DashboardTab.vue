<template>

	<main class="app-content dark">

		<div ref="container" class="canvas-container scrollable scr-x scr-y">

			<v-stage ref="stage" :config="stageConfig">
				<v-layer>
					<v-rect :config="backgroundConfig" />
				</v-layer>
			</v-stage>

		</div>

	</main>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

import Network from "@/services/Network";

let stageSize = {
	width: 1500,
	height: 980,
};

export default {

	components: {

	},

	watch: {
		'scale': 'resize',
	},

	data() {
		return {
			stageConfig: {
				width: stageSize.width,
				height: stageSize.height,
				scale: {
					x: 1,
					y: 1,
				}
			},

			backgroundConfig: {
				fill: '#ffffff',
				x: 0,
				y: 0,
				width: stageSize.width,
				height: stageSize.height
			},

		}
	},

	computed: {
		...get([
			'scale',
			'project',
		]),
	},

	methods: {

		resize() {

			let stage = this.$refs.stage.getStage();

			if ( ! this.scale) {

				stage.width(stageSize.width);
				stage.height(stageSize.height);
				stage.scale({ x: 1, y: 1 });
				stage.draw();

			} else {

				var container = this.$refs.container;
				// now we need to fit stage into parent
				var containerWidth = container.offsetWidth - 30;
				// to do this we need to scale the stage
				var scale = containerWidth / stageSize.width;

				var newWidth = stageSize.width * scale,
					newHeight = stageSize.height * scale;

				this.stageConfig.scale = {
					x: scale,
					y: scale
				};
				this.stageConfig.width = newWidth;
				this.stageConfig.height = newHeight;

				stage.width(newWidth);
				stage.height(newHeight);
				stage.scale({ x: scale, y: scale });
				stage.draw();

			}
		},
	},

	mounted() {
		this.resize();
	}

}

</script>

<style scoped>
pre {
	background: #efefef;
	font-size: 80%;
}
</style>
