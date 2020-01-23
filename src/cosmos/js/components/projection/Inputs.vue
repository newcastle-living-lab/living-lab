<template>

	<v-group ref="group" :config="groupConfig">

		<v-text :config="ethosConfig" />
		<v-arrow :config="ethosArrow" />

		<v-text :config="policyConfig" />
		<v-arrow :config="policyArrow" />

		<v-text :config="resourcesConfig" />
		<v-arrow :config="resourcesArrow" />

	</v-group>

</template>

<script>
import { mapState } from 'vuex';
import colours from 'colors.css';

let width = 120;

export default {

	props: {
		x: Number,
		y: Number,
	},

	computed: {

		...mapState('app', ['options']),

		groupConfig() {
			return { x: this.x, y: this.y }
		},

		ethosConfig() {
			return {
				x: 0,
				y: -75,
				width: width,
				text: "Ethos",
				fontSize: 18,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				fill: colours.olive,
				lineHeight: 1.3,
				padding: 0,
				align: 'right',
				verticalAlign: 'middle',
			}
		},

		ethosArrow() {
			return {
				x: width + 10,
				y: -75 + 9,
				points: [0, 0, width*0.6, width*0.4],
				pointerLength: 12,
				pointerWidth: 8,
				fill: colours.olive,
				stroke: colours.olive,
				strokeWidth: 4
			}
		},

		policyConfig() {
			return {
				x: 0,
				y: 0,
				width: width,
				text: "Policy & Law",
				fontSize: 18,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				fill: colours.black,
				lineHeight: 1.3,
				padding: 0,
				align: 'right',
				verticalAlign: 'middle',
			}
		},

		policyArrow() {
			return {
				x: width + 10,
				y: 12,
				points: [0, 0, width*0.55, 0],
				pointerLength: 12,
				pointerWidth: 8,
				fill: colours.gray,
				stroke: colours.gray,
				strokeWidth: 4
			}
		},

		resourcesConfig() {
			return {
				x: 0,
				y: 75,
				width: width,
				text: "Resources",
				fontSize: 18,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				fill: colours.black,
				lineHeight: 1.3,
				padding: 0,
				align: 'right',
				verticalAlign: 'middle',
			}
		},


		resourcesArrow() {
			return {
				x: width + 10,
				y: 75 + 9,
				points: [0, 0, width*0.6, -(width*0.4)],
				pointerLength: 12,
				pointerWidth: 8,
				fill: colours.gray,
				stroke: colours.gray,
				strokeWidth: 4
			}
		},

	}

}
</script>
