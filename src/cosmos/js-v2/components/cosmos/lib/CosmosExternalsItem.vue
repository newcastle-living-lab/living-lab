<template>

	<v-group
		:config="groupConfig"
		@mousemove="mousemove"
		@mouseout="mouseout"
		@click="launchUrl"
		@tap="launchUrl"
	>
		<v-rect :config="rectConfig" />
		<v-text :config="labelConfig" />
		<a :href="data.url" target="_blank" ref="link"></a>
	</v-group>

</template>

<script>

import { commit } from 'vuex-pathify';
import colours from 'colors.css';

export default {

	name: 'CosmosExternalsItem',

	props: {
		data: Object,
		config: Object,
		options: Object,
	},

	data() {
		return {
			isHovering: false
		}
	},

	computed: {

		colour() {
			return this.config.colour ? this.config.colour : colours.black;
		},

		groupConfig() {
			return {
				x: this.config.x,
				y: this.config.y
			};
		},

		rectConfig() {
			return {
				x: 0,
				y: 0,
				width: this.config.width,
				height: this.config.height,
				cornerRadius: this.config.height / 5,
				fill: this.isHovering ? colours.silver : null,
				strokeWidth: 1,
				stroke: this.colour,
			}
		},

		labelConfig() {
			return {
				x: 0,
				y: 0,
				width: this.config.width,
				height: this.config.height,
				padding: 5,
				text: this.data.label,
				fontSize: 12,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				align: 'center',
				verticalAlign: 'middle',
			};
		}

	},

	methods: {

		mousemove() {
			if (this.data.url) {
				this.isHovering = true;
				commit('START_STAGE_HOVER');
			}
		},

		mouseout() {
			if (this.data.url) {
				this.isHovering = false;
				commit('STOP_STAGE_HOVER');
			}
		},

		launchUrl() {
			if (this.data.url) {
				this.$refs.link.click();
			}
		},

	}

}
</script>
