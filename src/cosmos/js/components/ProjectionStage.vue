<template>

	<main ref="container" class="app-content dark">

		<div class="canvas-container scrollable scr-x scr-y">

			<v-stage ref="stage" :config="stageConfig">

				<v-layer>

					<v-rect :config="backgroundConfig" />

					<v-group :config="mainGroupConfig">

						<v-shape ref="structLine" :config="structLine" />
						<v-text ref="structText" :config="structText" />

						<v-shape ref="infraLine" :config="infraLine" />
						<v-text ref="infraText" :config="infraText" />


						<group-lozenge v-bind="serviceDefinitionConfig" />
						<group-lozenge v-bind="serviceDeliveryConfig" />

						<v-group :config="activitiesA">
							<group-activity ref="policyDefGroup" :dimensions="dimensions" :x="115" :y="0" prop="policyDef" />
							<group-activity ref="specDesGroup" :dimensions="dimensions" :x="0" :y="140" prop="specDes" />
							<group-activity ref="deploymentGroup" :dimensions="dimensions" :x="230" :y="140" prop="deployment" />
						</v-group>

						<v-line :config="splitterConfig" />

						<v-group :config="activitiesB">
							<group-activity ref="deliveryGroup" :dimensions="dimensions" :x="0" :y="0" prop="delivery" />
							<group-activity ref="evaluationGroup" :dimensions="dimensions" :x="0" :y="140" prop="evaluation" />
							<group-activity ref="userGroup" :dimensions="dimensions" :x="185" :y="0" prop="user" />
							<group-activity ref="beneficiaryGroup" :dimensions="dimensions" :x="185" :y="140" prop="beneficiary" />
						</v-group>

						<group-activity ref="initiatorGroup"
							:dimensions="dimensions"
							:x="350"
							:y="500"
							:circle="true"
							prop="initiator"
						/>

						<group-inputs v-bind="inputsConfig" />

					</v-group>

					<group-title ref="projectTitleGroup" :dimensions="dimensions" />

					<group-goals ref="goalsGroup" :dimensions="dimensions" />

					<group-services ref="externalServicesGroup"
						:dimensions="dimensions"
						:colour="colours.green"
						type="extsvc"
						labelProp="extSvcLabel"
					/>

					<group-services ref="externalOrganisationsGroup"
						:dimensions="dimensions"
						:colour="colours.fuchsia"
						type="extorg"
						labelProp="extOrgLabel"
					/>

					<group-services ref="infrastructuralServicesGroup"
						:dimensions="dimensions"
						:colour="colours.blue"
						type="infsvc"
						labelProp="infSvcLabel"
					/>


				</v-layer>
			</v-stage>
		</div>
	</main>

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
	width: 1500,
	height: 980,
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
				goalsGroup: {},
				extsvcGroup: {},
				extorgGroup: {},
				infsvcGroup: {},
			},

			stageConfig: {
				width: stageSize.width,
				height: stageSize.height,
				scale: {
					x: 1,
					y: 1,
				}
			},

			mainGroupConfig: {
				x: 0,
				y: 30,
			},

			colours: colours,

			backgroundConfig: {
				fill: '#ffffff',
				x: 0,
				y: 0,
				width: stageSize.width,
				height: stageSize.height
			},

			activitiesA: {
				x: 600,
				y: 220,
			},

			activitiesB: {
				x: 1050,
				y: 220,
			},

			inputsConfig: {
				x: 100,
				y: 520 + (25/2),
			},

			splitterConfig: {
				points: [
					(470 + 500) - 8, 200,
					(470 + 500) - 8, 580
				],
				stroke: colours.olive,
				strokeWidth: 2,
				dash: [9, 3]
			},

			serviceDefinitionConfig: {
				x: 470,
				y: 520,
				width: 500,
				label: "Service Definition and Development Platform",
			},

			serviceDeliveryConfig: {
				x: (470 + 500) - (25/1.5),
				y: 520,
				width: 500,
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
		'stageHover': 'updateCursor',
		// 'projectData.services': 'refreshPositions',
	},

	computed: {

		...mapState('project', {
			projectData: state => state.project.data
		}),

		...mapState('app', [
			'scale',
			'options',
			'stageHover',
		]),

		structLine() {
			let width = 125,
				height = 320;

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

		structText() {
			return {
				x: 460 + 125 - 10,
				y: 520-320 - 30,
				text: 'Structural Relationships and Occasions',
				fontSize: 16,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				fill: colours.red,
				lineHeight: 1.3,
			}
		},

		infraLine() {
			let width = 125,
				height = 320;

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
		},

		infraText() {
			return {
				x: 460 + 125 - 10,
				y: 520 + 50 + 320 + 15,
				text: 'Infrastructural Relationships, Recourses and Facilities',
				fontSize: 16,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				fill: colours.red,
				lineHeight: 1.3,
			}
		},

	},

	methods: {

		refreshPositions() {

			let stage = this.$refs.stage.getStage();

			this.$nextTick(() => {

				this.dimensions.goalsGroup = {
					x: 20,
					y: nodeRefs.projectTitle.getNode().absolutePosition().y + nodeRefs.projectTitle.getNode().getClientRect().height + 20,
				};

				stage.draw();

				const servicesHeight = 210;

				this.dimensions.extsvcGroup = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: stageSize.height - servicesHeight - 20 - 45,
					width: 510,
					height: servicesHeight,
				};

				this.dimensions.extorgGroup = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: stageSize.height - (servicesHeight*3.4) - 20,
					width: 510,
					height: servicesHeight,
				};

				this.dimensions.infsvcGroup = {
					x: stageSize.width - 510 - 20,
					y: stageSize.height - servicesHeight - 20 - 45,
					width: 510,
					height: servicesHeight,
				};

			});

		},

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
		},

		updateCursor() {
			this.$refs.stage.getStage().container().style.cursor = this.stageHover ? 'pointer' : 'default';
		}
	},

	mounted() {
		nodeRefs.projectTitle = this.$refs.projectTitleGroup.$refs.title;
		nodeRefs.goalsGroup = this.$refs.goalsGroup;
		nodeRefs.goalsBorder = this.$refs.goalsGroup.$refs.border;
		// nodeRefs.goalsBody = this.$refs.goalsGroup.$refs.body;
		// nodeRefs.goalsLabel = this.$refs.goalsGroup.$refs.label;
		// nodeRefs.servicesGroup = this.$refs.servicesGroup.$refs.border;
		this.refreshPositions();
		this.resize();
		// this.updatePositions();
	}

}
</script>
