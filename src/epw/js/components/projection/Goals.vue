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

		...mapState('app', ['options']),

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
				fontFamily: this.options.fontFamily,
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
				fontFamily: this.options.fontFamily,
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

	}

}
</script>
