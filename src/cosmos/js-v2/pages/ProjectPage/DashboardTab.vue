<template>

	<main class="app-content dark">

		<div ref="container" class="canvas-container scrollable scr-x scr-y" v-if="aspect">

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
						:aspectId="aspect.CONFIG.id"
					></component>
				</v-layer>
				<v-layer v-if="project.id && aspect.CONFIG.dashboardComponent">
					<component
						v-bind:is="aspect.CONFIG.dashboardComponent"
						:definitions="aspect.DEFINITIONS"
						:options="options"
						:aspectId="aspect.CONFIG.id"
					/>
				</v-layer>
			</v-stage>

		</div>


		<div class="modal modal-sm" :class="isExporting ? 'active' : ''">
			<div class="modal-overlay"></div>
			<div class="modal-container">
				<div class="modal-header">
					<div class="modal-title h5">Exporting...</div>
				</div>
				<div class="modal-body">
					<div class="content mb-4">
						<p>The export file is being generated.</p>
						<div class="loading loading-lg"></div>
					</div>
				</div>
			</div>
		</div>

	</main>

</template>

<script>

import throttle from 'lodash/throttle';
import { get, set, sync, call } from 'vuex-pathify';
import jsPDF from 'jspdf';

import { EventBus } from '@/services/EventBus';
import Aspects from '@/aspects';

import UserGuide from '@/components/UserGuide';

export default {

	name: 'DashboardTab',

	components: {
		UserGuide
	},

	props: {
		aspectId: [Boolean, String],
	},

	watch: {
		'scale': 'resize',
		'stageHover': 'setCursor',
		'project.id': {
			handler: function(newVal, oldVal) {
				if (oldVal !== newVal && typeof(newVal) != 'undefined') {
					this.resize();
				}
			},
		},
		'aspectId': {
			handler: function(newVal, oldVal) {
				if (oldVal !== newVal && typeof(newVal) != 'undefined') {
					this.resize();
				}
			},
		},
	},

	data() {
		return {
			isExporting: false,
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
		]),

		/**
		 * Get aspect (ALL data - CONFIG + DEFS etc!) based on supplied editor ID
		 *
		 */
		aspect() {
			const aspect = this.aspectId;
			if ( ! this.aspectId) {
				return null;
			}
			return Aspects.get(aspect);
		},
/*
		template() {
			if ( ! this.project.id) {
				return false;
			}
			var template = Templates.get(this.project.template);
			return template;
		},*/

		nodes() {
			return (this.aspect && this.aspect.NODES ? this.aspect.NODES : []);
		},

		backgroundConfig() {
			var config = {
				fill: '#ffffff',
				x: 0,
				y: 0,
				width: this.aspect.CONFIG.stageSize.width,
				height: this.aspect.CONFIG.stageSize.height,
			};
			return config;
		}

	},

	methods: {

		resize() {

			if ( ! this.project.id) {
				return;
			}

			if ( ! this.aspect) {
				return;
			}

			var container = null,
				maxWidth = null,
				maxHeight = null,
				stageSize = this.aspect.CONFIG.stageSize,
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
		},

		exportHandler(params) {

			var stage = this.$refs.stage.getStage();

			switch (params.target) {

				case 'image':
					this.isExporting = true;
					var image = stage.toDataURL({ pixelRatio: 2 });
					var link = document.createElement('a');
					link.download = `${this.project.name}.png`;
					link.href = image;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					this.isExporting = false;
				break;

				case 'pdf':

					this.isExporting = true;

					setTimeout(() => {

						var pdfPromise = (new Promise(resolve => {

							var w = stage.width(),
								h = stage.height();

							var image = stage.toDataURL({ pixelRatio: 1.5 });

							var pdf = new jsPDF('l', 'px', [w, h], false, true);
							var width = pdf.internal.pageSize.getWidth();
							var height = pdf.internal.pageSize.getHeight();

							pdf.addImage(image, 'PNG', 0, 0, width, height);
							var res = pdf.save(`${this.project.name}.pdf`, {returnPromise: true});
							res.then(() => resolve());
						}));

						pdfPromise.then(() => {
							this.isExporting = false;
						});

					}, 100);

				break;

			}

		}
	},

	mounted() {
		this.$nextTick(() => {
			this.resize();
			window.addEventListener('resize', throttle(this.resize, 250));
		});

		EventBus.$on('export', this.exportHandler);

	},

	destroyed() {
		window.removeEventListener("resize", throttle(this.resize, 250));
		EventBus.$off('export', this.exportHandler);
	}

}

</script>
