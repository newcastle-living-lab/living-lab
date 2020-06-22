<template>

	<main class="app-content dark">

		<div ref="container" class="canvas-container scrollable scr-x scr-y" v-if="template">

			<v-stage ref="stage" :config="stageConfig">
				<v-layer>
					<v-rect :config="backgroundConfig" />
				</v-layer>
				<v-layer v-if="this.project.id">
					<component
						v-for="(node, idx) in nodes"
						:key="idx"
						v-bind:is="node.componentName"
						:path="node.path"
						:ref="node.ref"
						:config="node.config"
						:children="node.children"
						:definitionName="node.definitionName"
						:options="options"
					></component>
				</v-layer>
			</v-stage>

		</div>

	</main>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

import Network from "@/services/Network";
import Templates from '@/templates';

export default {

	watch: {
		'scale': 'resize',
		'stageHover': 'setCursor',
	},

	data() {

		return {

		}
	},

	computed: {

		...get([
			'scale',
			'stageHover',
			'options',
			'project',
		]),

		template() {
			if ( ! this.project.id) {
				return false;
			}
			var template = Templates.get(this.project.template);
			return template;
		},

		nodes() {
			if ( ! this.template) {
				return [];
			}

			return this.template.NODES;
		},

		stageConfig() {

			var config = {
				width: 640,
				height: 480,
				scale: {
					x: 1,
					y: 1,
				}
			}

			if (this.template) {
				config.width = this.template.CONFIG.stageSize.width;
				config.height = this.template.CONFIG.stageSize.height;
			};

			return config;
		},

		backgroundConfig() {

			var config = {
				fill: '#ffffff',
				x: 0,
				y: 0,
				width: 640,
				height: 480
			};

			if (this.template) {
				config.width = this.template.CONFIG.stageSize.width;
				config.height = this.template.CONFIG.stageSize.height;
			};

		}

	},

	methods: {

		resize() {

			if ( ! this.project.id) {
				return;
			}

			if ( ! this.$refs.stage) {
				return;
			}

			let stageSize = this.template.CONFIG.stageSize;

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

		setCursor() {
			var cursor = this.stageHover ? 'pointer' : 'default';
			this.$refs.stage.getStage().container().style.cursor = cursor;
		}
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
