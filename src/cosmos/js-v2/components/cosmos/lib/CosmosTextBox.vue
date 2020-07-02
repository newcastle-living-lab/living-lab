<template>

	<v-group :config="groupConfig">
		<v-rect ref="border" :config="borderConfig" />
		<v-text ref="label" :config="labelConfig" />
	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';
import colours from 'colors.css';

export default {

	name: 'CosmosTextBox',

	data() {
		return {
			lineHeight: 1.3,
		}
	},

	props: {
		options: Object,
		definitionName: String,
		config: Object,
	},

	computed: {

		fontSize() {
			return this.config.fontSize ? this.config.fontSize : 14;
		},

		groupConfig() {
			return {
				x: this.config.x ? this.config.x : 0,
				y: this.config.y ? this.config.y : 0,
			};
		},

		labelConfig() {
			var x = this.config.width / 2;
			x -= this.config.textWidth / 2;

			return {
				x: x,
				y: 0,
				width: this.config.textWidth,
				height: this.config.height,
				text: this.config.label,
				fontSize: this.fontSize,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: this.lineHeight,
				align: 'center',
				verticalAlign: 'middle',
			}
		},

		borderConfig() {

			var height = this.labelHeight;

			return {
				x: 0,
				y: 0,
				width: this.config.width,
				height: this.config.height,
				cornerRadius: Math.ceil(this.config.height / 2),
				stroke: colours.black,
				strokeWidth: 2,
			}

		}

	}

}
</script>
