<template>

	<v-group>
		<v-text ref="label" :config="label" />
		<v-text ref="body" :config="body" />
		<v-rect ref="border" :config="border" />
	</v-group>

</template>

<script>

import { mapState } from 'vuex';
import colours from 'colors.css';

export default {

	data() {
		return {
			calculatedDims: {
				border: { x : 0, y: 0, width: 0, height: 0 },
				label: { x : 0, y: 0, width: 0, height: 0 },
				body: { x : 0, y: 0, width: 0, height: 0 },
			}
		}
	},

	props: {
		dimensions: Object,
	},

	computed: {

		...mapState('project', {
			projectData: state => state.project.data
		}),

		label() {

			let pos = {
				x: 0,
				y: 0,
				width: 0,
			};

			if (this.dimensions.goalsLabel) {
				pos = this.dimensions.goalsLabel;
			};

			return {
				x: pos.x,
				y: pos.y,
				width: pos.width,
				text: typeof this.projectData.goals == 'object' ? this.projectData.goals.label : '',
				fontSize: 14,
				fontStyle: 'bold',
				lineHeight: 1.3,
				align: 'center',
			}
		},

		body() {

			let pos = {
				x: 0,
				y: 0,
				width: 0,
			};

			if (this.dimensions.goalsBody) {
				pos = this.dimensions.goalsBody;
			};

			return {
				x: pos.x,
				y: pos.y,
				width: pos.width,
				text: typeof this.projectData.goals == 'object' ? this.projectData.goals.body : '',
				fontSize: 12,
				lineHeight: 1.3,
				padding: 10,
			}
		},

		border() {

			let pos = {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
			};

			if (this.dimensions.goalsBorder) {
				pos = this.dimensions.goalsBorder;
			};

			return {
				x: pos.x,
				y: pos.y,
				width: pos.width,
				height: pos.height,
				stroke: colours.black,
				strokeWidth: 1
			}
		}

	},

	watch: {
		// 'dimensions.title': 'titleChanged',
		// 'dimensions.goalsBody': 'goalsChanged',
		// 'dimensions.goalsLabel': 'goalsChanged',
		// 'projectData.goals.body': 'bodyChanged',
		// 'projectData.goals.label': 'sendDims',
		// 'projectData.goals.body': 'sendDims',
	},

	mounted() {
		// this.sendDims();
		// this.updateDims();
	},

	methods: {

		titleChanged() {
			// get title dims
			console.log('title changed size');
			console.log(this.dimensions.title);
			this.calculatedDims.label.y = this.dimensions.title.y + this.dimensions.title.height + 20 + 10;
			this.calculatedDims.label.x = this.dimensions.title.x;
			this.calculatedDims.label.width = this.dimensions.title.width;

			// this.calculatedDims.body.y = this.calculatedDims.label.y + this.dimensions.title.height + 20 + 10;
			// this.calculatedDims.body.x = this.dimensions.title.x;
			// this.calculatedDims.body.width = this.dimensions.title.width;
/*
			var labelDims = this.getNodeDims(this.$refs.goalsLabel.getNode());
			console.log(this.$refs.goalsLabel.getNode().getClientRect());

			this.calculatedDims.body.y = labelDims.y + labelDims.height + 10;
			this.calculatedDims.body.x = labelDims.x;
			this.calculatedDims.body.width = labelDims.width;*/
		},

		goalsChanged() {
			console.log('goals changed');
		},

		updateDims() {

			console.log('updateDims via change in dimensions');

			if (this.dimensions.title) {
				this.calculatedDims.border.x = this.dimensions.title.x;
				this.calculatedDims.border.y = this.dimensions.title.height + this.dimensions.title.y + 20;
			}

			this.calculatedDims.label.x = this.calculatedDims.border.x;
			this.calculatedDims.label.y = this.calculatedDims.border.y + 10;

			this.calculatedDims.body.x = this.calculatedDims.border.x;
			this.calculatedDims.body.y = this.calculatedDims.border.y + 10;

			if (this.calculatedDims.body && this.calculatedDims.label) {
				this.calculatedDims.border.height = (10 + 10 + 10 + this.calculatedDims.body.height + this.calculatedDims.label.height);
			}

			/*this.nodeConfigs.goalsBorder = {
					x: nodeRefs.projectTitle.getNode().absolutePosition().x,
					y: nodeRefs.projectTitle.getNode().absolutePosition().y + nodeRefs.projectTitle.getNode().getClientRect().height + 20,
					height: (10 + 10 + 10
					         + nodeRefs.goalsBody.getNode().getClientRect().height
					         + nodeRefs.goalsLabel.getNode().getClientRect().height)
				};*/
		},

		sendDims() {

			this.$nextTick(() => {

				var nodes = {
					goalsBorder: this.$refs.goalsBorder.getNode(),
					goalsLabel: this.$refs.goalsLabel.getNode(),
					goalsBody: this.$refs.goalsBody.getNode(),
				};

				const keys = Object.keys(nodes);

				for (const key of keys) {

					let node = nodes[key];
					let dims = this.getNodeDims(node);

					this.$emit('update-dims', {
						source: key,
						data: dims,
					});

				}

			});

		},

		getNodeDims(node) {
			return {
				x: node.absolutePosition().x,
				y: node.absolutePosition().y,
				height: node.getClientRect().height,
				width: node.getClientRect().width,
			}
		}

	}

}
</script>
