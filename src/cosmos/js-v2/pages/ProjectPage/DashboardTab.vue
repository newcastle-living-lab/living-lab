<template>

	<main class="app-content dark">

		<div ref="container" class="canvas-container scrollable scr-x scr-y" v-if="project.template">

			<v-stage ref="stage" :config="stageConfig">
				<v-layer>
					<v-rect :config="backgroundConfig" />
				</v-layer>
				<v-layer v-if="project.id && nodes.length">
					<component
						v-for="(node, idx) in nodes"
						:key="idx"
						v-bind:is="node.componentName"
						:path="node.path"
						:ref="node.ref"
						:config="node.config"
						:children="node.children"
						:definitionName="node.definitionName"
						:visibilityFunc="node.visibilityFunc"
						:options="options"
						:templateName="project.template"
					></component>
				</v-layer>
				<v-layer v-if="project.id && template.CONFIG.dashboard">
					<component
						v-bind:is="template.CONFIG.dashboard"
						:definitions="template.DEFINITIONS"
						:options="options"
					/>
				</v-layer>
			</v-stage>

		</div>

	</main>

</template>

<script>

import throttle from 'lodash/throttle';
import { get, set, sync, call } from 'vuex-pathify';

import Templates from '@/templates';

export default {

	watch: {
		'scale': 'resize',
		'isEditing': 'resize',
		'project.template': {
			handler: function(newVal, oldVal) {
				if (oldVal !== newVal && typeof(newVal) != 'undefined') {
					// console.log("template changed");
					this.resize();
				}
			},
			// deep: true
		},
		'stageHover': 'setCursor',
	},

	data() {
		return {
			stageConfig: {
				width: 640,
				height: 480,
				scale: {
					x: 1,
					y: 1,
				}
			}
		}
	},

	computed: {

		...get([
			'scale',
			'stageHover',
			'options',
			'project',
			'isEditing',
		]),

		template() {
			if ( ! this.project.id) {
				return false;
			}
			var template = Templates.get(this.project.template);
			return template;
		},

		nodes() {
			return (this.project.template && this.template.NODES ? this.template.NODES : []);
		},

		backgroundConfig() {
			var config = {
				fill: '#ffffff',
				x: 0,
				y: 0,
				width: this.stageConfig.width,
				height: this.stageConfig.height
			};
		}

	},

	methods: {

		resize() {

			if ( ! this.project.id) {
				return;
			}

			var container = null,
				maxWidth = null,
				maxHeight = null,
				stageSize = this.template.CONFIG.stageSize,
				width = stageSize.width,
				height = stageSize.height,
				newWidth = 0,
				newHeight = 0,
				ratio = 0;

			if (this.$refs.container) {
				container = this.$refs.container;
				maxWidth = container.offsetWidth - 30;
				maxHeight = container.offsetHeight - 15;
			}

			this.stageConfig.width = width;
			this.stageConfig.height = height;
			this.stageConfig.scale = { x: 1, y: 1 };

			// No scaling or container, just leave the values as they are (100% size)
			if ( ! this.scale || ! container) {
				return;
			}

			// Scale is still `on`, but the size already fits: no need to scale
			if (width < maxWidth && height < maxHeight) {
				return;
			}

			/*
			var dims = {
				width: width,
				maxWidth: maxWidth,
				height: height,
				maxHeight: maxHeight
			};
			console.log(dims);
			*/

			// Width is larger
			if (width > maxWidth) {
				ratio = maxWidth / width;
				newWidth = maxWidth;
				newHeight = height * ratio;
				height = height * ratio;
				width = width * ratio;
			}

			// Height is larger
			if (height > maxHeight) {
				ratio = maxHeight / height;
				newWidth = width * ratio;
				newHeight = maxHeight;
			}

			this.stageConfig.width = newWidth;
			this.stageConfig.height = newHeight;

			var scale = {
				x: newWidth / stageSize.width,
				y: newHeight / stageSize.height
			};

			this.stageConfig.scale = scale;

			// this.$refs.stage.getNode().draw();

			return;
		},

		setCursor() {
			var cursor = this.stageHover ? 'pointer' : 'default';
			this.$refs.stage.getStage().container().style.cursor = cursor;
		}
	},

	mounted() {
		this.$nextTick(() => {
			this.resize();
			window.addEventListener('resize', throttle(this.resize, 250));
		});
	},

	destroyed() {
		window.removeEventListener("resize", throttle(this.resize, 250));
	}

}

</script>
