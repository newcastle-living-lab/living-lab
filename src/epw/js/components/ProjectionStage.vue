<template>

	<div ref="container" class="canvas-container">

		<v-stage ref="stage" :config="stageSize">
			<v-layer>

				<v-text ref="projectTitle" :config="projectTitleConfig"/>

				<v-text ref="goalsLabel" :config="goalsLabelConfig"/>
				<v-text ref="goalsBody" :config="goalsBodyConfig"/>
				<v-rect ref="goalsBorder" :config="goalsBorderConfig"/>

				<v-rect ref="servicesBorder" :config="servicesBorderConfig"/>
				<v-text ref="servicesLabel" :config="servicesLabelConfig"/>

				<v-group>
					<v-line :config="staticNodes.structuralLineOuter"/>
					<v-line :config="staticNodes.structuralLineInner"/>
					<v-text :config="staticNodes.structuralText"/>
				</v-group>

				<v-group>
					<v-line :config="staticNodes.infrastructuralLineOuter"/>
					<v-line :config="staticNodes.infrastructuralLineInner"/>
					<v-text :config="staticNodes.infrastructuralText"/>
				</v-group>

				<v-group>
					<v-regular-polygon :config="staticNodes.resourcesShape"/>
					<v-text :config="staticNodes.resourcesText"/>
				</v-group>

				<v-group>
					<v-rect :config="staticNodes.lawShape"/>
					<v-text :config="staticNodes.lawText"/>
				</v-group>

				<v-group>
					<v-rect :config="staticNodes.ethosShape"/>
					<v-text :config="staticNodes.ethosText"/>
				</v-group>


			</v-layer>
		</v-stage>
	</div>

</template>

<script>

import { mapState, mapActions } from 'vuex';
import colours from 'colors.css';
import staticNodes from '../data/staticNodes';

import { createHelpers } from 'vuex-map-fields';
const { mapFields } = createHelpers({
	getterType: 'projects/getCurrentProjectDataField',
	mutationType: 'projects/updateCurrentProjectDataField',
});

export default {

	data() {

		return {

			nodeRefs: {
				projectTitle: null,
				goalsBody: null,
			},

			nodeConfigs: {
				projectTitle: null,
				goalsBorder: {},
				goalsLabel: {},
				goalsBody: {},
				servicesLabel: {},
			},

			staticNodes: staticNodes,

			colours: colours,

			stageSize: {
				width: 1260,
				height: 1030
			},

		}
	},


	watch: {
		'title': 'refreshPositions',
		'goals.label': 'refreshPositions',
		'goals.body': 'refreshPositions',
		'servicesLabel': 'refreshPositions',
		'services': 'refreshPositions',
	},

	computed: {
		...mapFields([
			'title',
			'goals',
			'servicesLabel',
		]),
		projectTitleConfig() {
			return {
				text: this.title,
				fontSize: 20,
				fontStyle: 'bold',
				lineHeight: 1.3,
				x: 20,
				y: 20,
				width: 400,
			}
		},
		goalsLabelConfig() {
			return {
				text: typeof this.goals == 'object' ? this.goals.label : '',
				fontSize: 14,
				fontStyle: 'bold',
				lineHeight: 1.3,
				align: 'center',
				x: this.nodeConfigs.goalsLabel.x,
				y: this.nodeConfigs.goalsLabel.y,
				width: 400 - 20 - 20,
			}
		},
		goalsBodyConfig() {
			return {
				text: typeof this.goals == 'object' ? this.goals.body : '',
				fontSize: 12,
				lineHeight: 1.3,
				x: this.nodeConfigs.goalsBody.x,
				y: this.nodeConfigs.goalsBody.y,
				width: 400 - 20 - 20,
			}
		},
		goalsBorderConfig() {
			return {
				x: this.nodeConfigs.goalsBorder.x,
				y: this.nodeConfigs.goalsBorder.y,
				width: 400,
				height: this.nodeConfigs.goalsBorder.height,
				stroke: colours.black,
				strokeWidth: 1
			}
		},
		servicesBorderConfig() {
			return {
				x: 20,
				y: 1030 - 250 - 20,
				width: 510,
				height: 250,
				stroke: colours.orange,
				strokeWidth: 1
			};
		},
		servicesLabelConfig() {
			return {
				text: this.servicesLabel,
				fontSize: 14,
				fontStyle: 'bold',
				lineHeight: 1.3,
				align: 'center',
				x: this.nodeConfigs.servicesLabel.x,
				y: this.nodeConfigs.servicesLabel.y,
				width: 510 - 10 - 10,
			}
		}
	},

	methods: {
		refreshPositions() {
			this.$nextTick(() => {

				// console.log('Refreshing');
				// console.log(this.nodeRefs.projectTitle.getNode().getClientRect());

				// Goals

				this.nodeConfigs.goalsBorder = {
					x: this.nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: this.nodeRefs.projectTitle.getNode().absolutePosition().y + this.nodeRefs.projectTitle.getNode().getClientRect().height + 20,
					height: (10 + 10 + 10
					         + this.nodeRefs.goalsBody.getNode().getClientRect().height
					         + this.nodeRefs.goalsLabel.getNode().getClientRect().height)
				};

				this.nodeConfigs.goalsLabel = {
					x: 20 + 10,
					y: this.nodeConfigs.goalsBorder.y + 10,
				};

				this.nodeConfigs.goalsBody = {
					x: 20 + 10,
					y: this.nodeConfigs.goalsLabel.y + this.nodeRefs.goalsLabel.getNode().getClientRect().height + 10,
				};

				// Services

				this.nodeConfigs.servicesLabel = {
					x: 20 + 10,
					y: this.nodeRefs.servicesBorder.getNode().absolutePosition().y + 10
				}
			});

		}
	},

	mounted() {
		this.nodeRefs.projectTitle = this.$refs.projectTitle;
		this.nodeRefs.goalsBody = this.$refs.goalsBody;
		this.nodeRefs.goalsLabel = this.$refs.goalsLabel;
		this.nodeRefs.servicesBorder = this.$refs.servicesBorder;
		this.refreshPositions();
	}

}
</script>
