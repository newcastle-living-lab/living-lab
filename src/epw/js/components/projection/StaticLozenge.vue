<template>

	<v-group :config="groupConfig">
		<v-rect ref="border" :config="borderConfig" />
		<v-text ref="label" :config="labelConfig" />
	</v-group>

</template>

<script>

import { mapState } from 'vuex';
import colours from 'colors.css';

export default {

	props: {
		width: Number,
		x: Number,
		y: Number,
		label: String,
	},

	data() {
		return {
			height: 50,
		}
	},

	computed: {

		...mapState('app', ['options']),

		groupConfig() {
			return {
				x: this.x,
				y: this.y
			}
		},

		borderConfig() {
			return {
				x: 0,
				y: 0,
				width: this.width,
				height: this.height,
				cornerRadius: this.height / 2,
				stroke: colours.black,
				strokeWidth: 2,
			}
		},

		labelConfig() {
			return {
				text: this.label,
				fontSize: 14,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				x: (this.width - (this.width * 0.6)) / 2,
				y: 0,
				width: this.width * 0.6,
				height: this.height,
				padding: 0,
				align: 'center',
				verticalAlign: 'middle',
			}
		}

	}

}
</script>
