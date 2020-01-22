<template>

	<v-group :config="groupConfig">
		<v-text ref="label" :config="label" />
		<v-text ref="body" :config="body" />
		<v-rect ref="border" :config="border" />
	</v-group>

</template>

<script>

import { mapState } from 'vuex';
import colours from 'colors.css';

let nodeRefs = {};

export default {

	props: {
		dimensions: Object,
	},

	data() {
		return {
			height: 0,
		}
	},

	watch: {
		'projectData.goals.body': 'refreshPositions',
	},

	computed: {

		...mapState('app', ['options']),

		...mapState('project', {
			projectData: state => state.project.data
		}),

		groupConfig() {

			let pos = {
				x: 0,
				y: 0,
				width: 400,
				height: 0,
			};

			if (this.dimensions.goalsGroup) {
				pos = this.dimensions.goalsGroup;
			};

			return pos;
		},

		label() {
			return {
				x: 0,
				y: 0,
				width: 400,
				text: typeof this.projectData.goals == 'object' ? this.projectData.goals.label : '',
				fontSize: 14,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				padding: 10,
				align: 'left',
			}
		},

		body() {
			return {
				x: 0,
				y: 20,
				width: 400,
				text: typeof this.projectData.goals == 'object' ? this.projectData.goals.body : '',
				fontFamily: this.options.fontFamily,
				fontSize: 12,
				lineHeight: 1.3,
				padding: 10,
			}
		},

		border() {
			return {
				x: 0,
				y: 0,
				width: 400,
				height: this.height,
				stroke: colours.black,
				strokeWidth: 1
			}
		}

	},

	methods: {
		refreshPositions() {
			this.$nextTick(() => {
				if (nodeRefs.body) {
					this.height = nodeRefs.body.getNode().getClientRect().height
						+ nodeRefs.label.getNode().getClientRect().height
						- 20;
				}
			});
		}
	},

	mounted() {
		nodeRefs.label = this.$refs.label;
		nodeRefs.body = this.$refs.body;
	}

}
</script>
