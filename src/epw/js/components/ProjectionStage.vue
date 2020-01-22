<template>

	<div ref="container" class="canvas-container scrollable scr-x scr-y">

		<v-stage ref="stage" :config="stageConfig">

			<v-layer>

				<v-rect :config="backgroundConfig" />

				<v-shape ref="structLine" :config="structLine" />
				<v-shape ref="infraLine" :config="infraLine" />

				<group-lozenge v-bind="serviceDefinitionConfig" />
				<group-lozenge v-bind="serviceDeliveryConfig" />

				<group-title ref="projectTitleGroup" :dimensions="dimensions" />

				<group-goals ref="goalsGroup" :dimensions="dimensions" />

				<group-services ref="servicesGroup" :dimensions="dimensions" />

				<v-group :config="activitiesA">
					<group-activity ref="policyDefGroup" :dimensions="dimensions" :x="100" :y="0" prop="policyDef" />
					<group-activity ref="specDesGroup" :dimensions="dimensions" :x="0" :y="140" prop="specDes" />
					<group-activity ref="deploymentGroup" :dimensions="dimensions" :x="200" :y="140" prop="deployment" />
				</v-group>

				<v-line :config="splitterConfig" />

				<v-group :config="activitiesB">
					<group-activity ref="deliveryGroup" :dimensions="dimensions" :x="0" :y="0" prop="delivery" />
					<group-activity ref="evaluationGroup" :dimensions="dimensions" :x="0" :y="140" prop="evaluation" />
					<group-activity ref="userGroup" :dimensions="dimensions" :x="170" :y="0" prop="user" />
					<group-activity ref="beneficiaryGroup" :dimensions="dimensions" :x="170" :y="140" prop="beneficiary" />
				</v-group>

				<group-activity ref="initiatorGroup"
					:dimensions="dimensions"
					:x="350"
					:y="500"
					:circle="true"
					prop="initiator"
				/>

				<group-inputs v-bind="inputsConfig" />

			</v-layer>
		</v-stage>
	</div>

</template>

<script>

import { mapState } from 'vuex';
import colours from 'colors.css';

import GroupStructural from './projection/Structural.vue';
import GroupInfrastructural from './projection/Infrastructural.vue';

import GroupLozenge from './projection/StaticLozenge.vue';
import GroupInputs from './projection/Inputs.vue';

import GroupTitle from './projection/Title.vue';
import GroupGoals from './projection/Goals.vue';
import GroupServices from './projection/Services.vue';
import GroupBeneficiary from './projection/Beneficiary.vue';
import GroupActivity from './projection/Activity.vue';

let nodeRefs = {};

let stageSize = {
	width: 1400,
	height: 1100,
};

export default {

	components: {
		GroupTitle,
		GroupGoals,
		GroupStructural,
		GroupInfrastructural,
		GroupServices,
		GroupBeneficiary,
		GroupActivity,
		GroupLozenge,
		GroupInputs,
	},

	data() {

		return {

			dimensions: {
				projectTitle: {},
				servicesGroup: {},
				goalsGroup: {},
			},

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

			activitiesA: {
				x: 600,
				y: 100,
			},

			activitiesB: {
				x: 1000,
				y: 100,
			},

			inputsConfig: {
				x: 100,
				y: 520 + (25/2),
			},

			splitterConfig: {
				points: [ (470 + 460) - 10 , 50, (470 + 460) - 10, 580],
				stroke: colours.olive,
				strokeWidth: 2,
				dash: [9, 3]
			},

			serviceDefinitionConfig: {
				x: 470,
				y: 520,
				width: 460,
				label: "Service Definition and Development Platform",
			},

			serviceDeliveryConfig: {
				x: 920 - (25 / 2),
				y: 520,
				width: 460,
				label: "Service Delivery Platform",
			}

		}
	},


	watch: {
		'projectData.title': 'refreshPositions',
		'projectData.goals.label': 'refreshPositions',
		'projectData.goals.body': 'refreshPositions',
		'projectData.goals': 'refreshPositions',
		'projectData.servicesLabel': 'refreshPositions',
		'scale': 'resize',
		// 'projectData.services': 'refreshPositions',
	},

	computed: {
		...mapState('project', {
			projectData: state => state.project.data
		}),
		...mapState('app', ['scale']),

		structLine() {
			let width = 125,
				height = 450;

			let pts = {
				st: [width, 0],
				ct: [
					width, height/4,
					width, height
				],
				en: [0, height]
			};

			return {
				x: 460,
				y: (520 - height),
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
		},

		infraLine() {
			let width = 125,
				height = 450;

			let pts = {
				st: [0, 0],
				ct: [
					width, 0,
					width, height/4
				],
				en: [width, height]
			};

			return {
				x: 460,
				y: 520 + 50 + 4,
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
	},

	methods: {

		refreshPositions() {

			this.$nextTick(() => {

				this.dimensions.goalsGroup = {
					x: 20,
					y: nodeRefs.projectTitle.getNode().absolutePosition().y + nodeRefs.projectTitle.getNode().getClientRect().height + 20,
				};

				var servicesHeight = 210;
				this.dimensions.servicesGroup = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: stageSize.height - servicesHeight - 20,
					width: 510,
					height: servicesHeight,
				};
			});

		},

		resize() {

			var stage = this.$refs.stage.getStage();

			if ( ! this.scale) {

				stage.width(stageSize.width);
				stage.height(stageSize.height);
				stage.scale({ x: 1, y: 1 });
				stage.draw();

			} else {

				var container = this.$refs.container;
				// now we need to fit stage into parent
				var containerWidth = container.offsetWidth;
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

			// this.refreshPositions();

			// stage.width();
			// stage.height(stageHeight * scale);
			// stage.scale({ x: scale, y: scale });
			// stage.draw();
		}
	},

	mounted() {
		nodeRefs.projectTitle = this.$refs.projectTitleGroup.$refs.title;
		// nodeRefs.goalsBody = this.$refs.goalsGroup.$refs.body;
		// nodeRefs.goalsLabel = this.$refs.goalsGroup.$refs.label;
		nodeRefs.servicesGroup = this.$refs.servicesGroup.$refs.border;
		this.refreshPositions();
		this.resize();
		// this.updatePositions();
	}

}
</script>
