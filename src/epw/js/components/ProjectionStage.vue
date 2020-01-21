<template>

	<div ref="container" class="canvas-container">

		<v-stage ref="stage" :config="stageConfig">
			<v-layer>

				<group-title ref="projectTitleGroup" :dimensions="dimensions" />

				<group-goals ref="goalsGroup" :dimensions="dimensions" />

				<group-services ref="servicesGroup" :dimensions="dimensions" />

				<!-- <group-beneficiary ref="beneficiaryGroup" :dimensions="dimensions" /> -->
				<group-activity ref="policyDefGroup" :dimensions="dimensions" :x="740" :y="100" prop="policyDef" />
				<group-activity ref="specDesGroup" :dimensions="dimensions" :x="640" :y="240" prop="specDes" />
				<group-activity ref="deploymentGroup" :dimensions="dimensions" :x="840" :y="240" prop="deployment" />

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
				goalsBorder: {},
				goalsLabel: {},
				goalsBody: {},
				servicesLabel: {},
				servicesBorder: {},
				servicesGroup: {},
			},

			stageConfig: {
				width: stageSize.width,
				height: stageSize.height,
				scale: {
					x: 1,
					y: 1,
				}
			}

		}
	},


	watch: {
		'projectData.title': 'refreshPositions',
		'projectData.goals.label': 'refreshPositions',
		'projectData.goals.body': 'refreshPositions',
		'projectData.goals': 'refreshPositions',
		'projectData.servicesLabel': 'refreshPositions',
		// 'projectData.services': 'refreshPositions',
	},

	computed: {
		...mapState('project', {
			projectData: state => state.project.data
		}),
	},

	methods: {

		refreshPositions() {

			this.$nextTick(() => {

				// console.log('Refreshing');

				this.dimensions.goalsBorder = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: nodeRefs.projectTitle.getNode().absolutePosition().y + nodeRefs.projectTitle.getNode().getClientRect().height + 20,
					height: ( 10 + 10 + nodeRefs.goalsLabel.getNode().getClientRect().height + nodeRefs.goalsBody.getNode().getClientRect().height),
					width: nodeRefs.projectTitle.getNode().getClientRect().width,
				};

				this.dimensions.goalsLabel = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: this.dimensions.goalsBorder.y + 10,
					width: nodeRefs.projectTitle.getNode().getClientRect().width,
				};

				this.dimensions.goalsBody = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: this.dimensions.goalsLabel.y + nodeRefs.goalsLabel.getNode().getClientRect().height,
					width: nodeRefs.projectTitle.getNode().getClientRect().width,
				};

				var servicesHeight = 210;
				this.dimensions.servicesGroup = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: stageSize.height - servicesHeight - 20,
					width: 510,
					height: servicesHeight,
				};
/*
				var servicesHeight = 210;
				this.dimensions.servicesBorder = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: this.stageConfig.height,	// - servicesHeight - 20,
					height: servicesHeight,
					width: 510,
				};

				this.dimensions.servicesLabel = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: nodeRefs.servicesBorder.getNode().absolutePosition().y + 10,
					width: 510,
				};*/
			});

		},

		resize() {

			var container = this.$refs.container;
			// now we need to fit stage into parent
			var containerWidth = container.offsetWidth;
			// to do this we need to scale the stage
			var scale = containerWidth / stageSize.width;

			var newWidth = stageSize.width * scale,
				newHeight = stageSize.height * scale;

			var stage = this.$refs.stage.getStage();

			this.stageConfig.scale = {
				x: scale,
				y: scale
			};
			this.stageConfig.width = newWidth;
			this.stageConfig.height = newHeight;

			stage.width(newWidth);
			stage.height(newHeight);
			stage.scale({ x: scale, y: scale });
			stage.draw({ x: scale, y: scale });

			// stage.width();
			// stage.height(stageHeight * scale);
			// stage.scale({ x: scale, y: scale });
			// stage.draw();
		}
	},

	mounted() {
		nodeRefs.projectTitle = this.$refs.projectTitleGroup.$refs.title;
		nodeRefs.goalsBody = this.$refs.goalsGroup.$refs.body;
		nodeRefs.goalsLabel = this.$refs.goalsGroup.$refs.label;
		nodeRefs.servicesBorder = this.$refs.servicesGroup.$refs.border;
		this.resize();
		this.refreshPositions();
		// this.updatePositions();
	}

}
</script>
