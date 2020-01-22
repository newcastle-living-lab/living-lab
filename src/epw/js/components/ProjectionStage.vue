<template>

	<div ref="container" class="canvas-container scrollable scr-x scr-y">

		<v-stage ref="stage" :config="stageConfig">
			<v-layer>

				<group-title ref="projectTitleGroup" :dimensions="dimensions" />

				<group-goals ref="goalsGroup" :dimensions="dimensions" />

				<group-services ref="servicesGroup" :dimensions="dimensions" />

				<!-- <group-beneficiary ref="beneficiaryGroup" :dimensions="dimensions" /> -->

				<v-group :config="activitiesA">
					<group-activity ref="policyDefGroup" :dimensions="dimensions" :x="100" :y="0" prop="policyDef" />
					<group-activity ref="specDesGroup" :dimensions="dimensions" :x="0" :y="140" prop="specDes" />
					<group-activity ref="deploymentGroup" :dimensions="dimensions" :x="200" :y="140" prop="deployment" />
				</v-group>

				<v-line :config="splitterConfig" />

				<v-group :config="activitiesB">
					<group-activity ref="deliveryGroup" :dimensions="dimensions" :x="0" :y="0" prop="delivery" />
					<group-activity ref="evaluationGroup" :dimensions="dimensions" :x="0" :y="140" prop="evaluation" />
				</v-group>

				<group-ethos />
				<group-resources />
				<group-law />
				<!-- <group-structural />
				<group-infrastructural /> -->

			</v-layer>
		</v-stage>
	</div>

</template>

<script>

import { mapState } from 'vuex';
import colours from 'colors.css';

import GroupEthos from './projection/Ethos.vue';
import GroupResources from './projection/Resources.vue';
import GroupLaw from './projection/Law.vue';
import GroupStructural from './projection/Structural.vue';
import GroupInfrastructural from './projection/Infrastructural.vue';

import GroupTitle from './projection/Title.vue';
import GroupGoals from './projection/Goals.vue';
import GroupServices from './projection/Services.vue';
import GroupBeneficiary from './projection/Beneficiary.vue';
import GroupActivity from './projection/Activity.vue';

let nodeRefs = {};

let stageSize = {
	width: 2010,
	height: 1030,
};

export default {

	components: {
		GroupTitle,
		GroupGoals,
		GroupEthos,
		GroupResources,
		GroupLaw,
		GroupStructural,
		GroupInfrastructural,
		GroupServices,
		GroupBeneficiary,
		GroupActivity,
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

			activitiesA: {
				x: 640,
				y: 100,
			},

			activitiesB: {
				x: 1000,
				y: 100,
			},

			splitterConfig: {
				points: [970, 100, 970, 540],
				stroke: colours.olive,
				strokeWidth: 2,
				dash: [6, 4]
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
