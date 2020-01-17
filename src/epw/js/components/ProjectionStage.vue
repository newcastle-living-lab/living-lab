<template>

	<div ref="container" class="canvas-container">

		<v-stage ref="stage" :config="stageSize">
			<v-layer>

				<group-title ref="projectTitleGroup" :dimensions="dimensions" />

				<group-goals ref="goalsGroup" :dimensions="dimensions" />

				<group-services ref="servicesGroup" :dimensions="dimensions" />

				<group-beneficiary ref="beneficiaryGroup" :dimensions="dimensions" />

				<group-ethos />
				<group-resources />
				<group-law />
				<group-structural />
				<group-infrastructural />

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

let nodeRefs = {};

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
			},

			stageSize: {
				width: 1260,
				height: 1030
			},

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

				this.dimensions.servicesBorder = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: this.stageSize.height - 250 - 20,
					height: 250,
					width: 510,
				};

				this.dimensions.servicesLabel = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: nodeRefs.servicesBorder.getNode().absolutePosition().y + 10,
					width: 510,
				};
			});

		}
	},

	mounted() {
		nodeRefs.projectTitle = this.$refs.projectTitleGroup.$refs.title;
		nodeRefs.goalsBody = this.$refs.goalsGroup.$refs.body;
		nodeRefs.goalsLabel = this.$refs.goalsGroup.$refs.label;
		nodeRefs.servicesBorder = this.$refs.servicesGroup.$refs.border;
		this.refreshPositions();
		// this.updatePositions();
	}

}
</script>
