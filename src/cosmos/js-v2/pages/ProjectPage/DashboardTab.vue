<template>

	<main class="app-content dark">

		<div ref="container" class="canvas-container scrollable scr-x scr-y">

			<v-stage ref="stage" :config="stageConfig">
				<v-layer>
					<v-rect :config="backgroundConfig" />
				</v-layer>
				<v-layer>
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

// @TODO move to central place for template
const templateNodes = [
	{
		componentName: 'CosmosTitle',
		definitionName: 'model',
	},
	{
		componentName: 'CosmosNodeBracket',
		config: {
			position: 'above',
			label: 'Meso',
			labelColour: '#3d9970',
			lineColour: '#0074d9',
			description: 'There may be a number of stages at this level.',
			x: 242,
			y: 215,
			width: 310,
		}
	},
	{
		componentName: 'CosmosNodeBracket',
		config: {
			position: 'below',
			label: 'Macro',
			labelColour: '#3d9970',
			lineColour: '#85144b',
			x: 85,
			y: 400,
			width: 300,
		}
	},
	{
		componentName: 'CosmosNodeBracket',
		config: {
			position: 'below',
			label: 'Micro',
			labelColour: '#3d9970',
			lineColour: '#0074d9',
			x: 400,
			y: 400,
			width: 300,
		}
	},
	{
		componentName: 'v-line',
		comment: 'Serv Pol Maker -- Serv Org Mgr',
		config: {
			x: 140,
			y: 270,
			points: [0, 0, 45, 0],
			stroke: '#ff4136',
			strokeWidth: 6,
			lineCap: 'round',
			lineJoin: 'round'
		},
	},
	{
		componentName: 'v-line',
		comment: 'Serv Org Mgr -- Serv Del Mgr',
		config: {
			x: 295,
			y: 270,
			points: [0, 0, 45, 0],
			stroke: '#ff4136',
			strokeWidth: 6,
			lineCap: 'round',
			lineJoin: 'round'
		},
	},
	{
		componentName: 'v-line',
		comment: 'Serv Del Mgr -- Front Line Serv Del',
		config: {
			x: 450,
			y: 270,
			points: [0, 0, 45, 0],
			stroke: '#ff4136',
			strokeWidth: 6,
			lineCap: 'round',
			lineJoin: 'round'
		},
	},
	{
		componentName: 'v-line',
		comment: 'Front Line Serv Del -- Client/User',
		config: {
			x: 605,
			y: 270,
			points: [0, 0, 45, 0],
			stroke: '#ff4136',
			strokeWidth: 6,
			lineCap: 'round',
			lineJoin: 'round'
		},
	},
	{
		componentName: 'CosmosStakeholder',
		definitionName: 'serviceDeliveryManager',
		config: {
			group: {
				x: 345,
				y: 225
			}
		}
	},
	{
		componentName: 'CosmosStakeholder',
		definitionName: 'frontLineServiceDeliverer',
		config: {
			group: {
				x: 500,
				y: 225
			}
		}
	},
	{
		componentName: 'CosmosStakeholder',
		definitionName: 'user',
		config: {
			group: {
				x: 655,
				y: 225
			}
		}
	},
	{
		componentName: 'CosmosStakeholder',
		definitionName: 'serviceOrganisationManager',
		config: {
			group: {
				x: 190,
				y: 225
			}
		}
	},
	{
		componentName: 'CosmosStakeholder',
		definitionName: 'servicePolicyMaker',
		config: {
			group: {
				x: 35,
				y: 225
			}
		}
	},
	{
		componentName: 'CosmosGroup',
		comment: 'Lines for right side',
		config: {
			x: 870,
			y: 30,
		},
		children: [
			{
				componentName: 'v-line',
				comment: 'instigator -- changemaker',
				config: {
					x: 100,
					y: 315,
					points: [0, 0, 190, 0],
					stroke: '#ff4136',
					strokeWidth: 3,
					dash: [15, 5],
				},
			},
			{
				componentName: 'v-line',
				comment: 'instigator -- broker',
				config: {
					x: 100,
					y: 270,
					points: [0, 0, 45, -45],
					stroke: '#ff4136',
					strokeWidth: 3,
					dash: [15, 5],
				},
			},
			{
				componentName: 'v-line',
				comment: 'broker -- changeTheorists',
				config: {
					x: 245,
					y: 135,
					points: [0, 0, 45, -45],
					stroke: '#ff4136',
					strokeWidth: 3,
					dash: [15, 5],
				},
			},
			{
				componentName: 'v-line',
				comment: 'instigators -- subjects',
				config: {
					x: 100,
					y: 360,
					points: [0, 0, 45, 45],
					stroke: '#ff4136',
					strokeWidth: 3,
					dash: [15, 5],
				},
			},
			{
				componentName: 'v-line',
				comment: 'victims -- subjects',
				config: {
					x: 100,
					y: 540,
					points: [0, 0, 45, -45],
					stroke: '#ff4136',
					strokeWidth: 3,
					dash: [15, 5],
				},
			},
			{
				componentName: 'v-line',
				comment: 'subjects -- changemakers',
				config: {
					x: 245,
					y: 405,
					points: [0, 0, 45, -45],
					stroke: '#ff4136',
					strokeWidth: 3,
					dash: [15, 5],
				},
			},
			{
				componentName: 'v-line',
				comment: 'subjects -- beneficiaries',
				config: {
					x: 245,
					y: 495,
					points: [0, 0, 45, 45],
					stroke: '#ff4136',
					strokeWidth: 3,
					dash: [15, 5],
				},
			},
			{
				componentName: 'v-line',
				comment: 'broker -- changemakers',
				config: {
					x: 245,
					y: 225,
					points: [0, 0, 45, 45],
					stroke: '#ff4136',
					strokeWidth: 3,
					dash: [15, 5],
				},
			},
		]
	},
	{
		componentName: 'CosmosGroup',
		config: {
			x: 870,
			y: 30,
		},
		children: [
			{
				componentName: 'CosmosStakeholder',
				definitionName: 'instigatorsOfChange',
				config: {
					group: {
						x: 0,
						y: 270,
					}
				}
			},
			{
				componentName: 'CosmosStakeholder',
				definitionName: 'changeMakers',
				config: {
					group: {
						x: 290,
						y: 270,
					}
				}
			},
			{
				componentName: 'CosmosStakeholder',
				definitionName: 'subjectsOfChange',
				config: {
					group: {
						x: 145,
						y: 405,
					}
				}
			},
			{
				componentName: 'CosmosStakeholder',
				definitionName: 'broker',
				config: {
					group: {
						x: 145,
						y: 135
					}
				}
			},
			{
				componentName: 'CosmosStakeholder',
				definitionName: 'changeTheorists',
				config: {
					group: {
						x: 290,
						y: 0
					}
				}
			},
			{
				componentName: 'CosmosStakeholder',
				definitionName: 'beneficiaries',
				config: {
					group: {
						x: 290,
						y: 540
					}
				}
			},
			{
				componentName: 'CosmosStakeholder',
				definitionName: 'victims',
				config: {
					group: {
						x: 0,
						y: 540
					}
				}
			},
		]
	},
];


// @TODO set in template
let stageSize = {
	width: 1285,
	height: 750,
};

export default {

	watch: {
		'scale': 'resize',
		'stageHover': 'setCursor',
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

			nodes: templateNodes

		}
	},

	computed: {
		...get([
			'scale',
			'stageHover',
			'options',
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
