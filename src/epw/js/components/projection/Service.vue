<template>

	<v-group :config="groupConfig">
		<v-text :config="label" />
		<v-rect :config="rect" @mousemove="onMousemove" @mouseout="onMouseout" @click="launchUrl" @tap="launchUrl" />
		<a :href="service.url" target="_blank" ref="link"></a>
	</v-group>

</template>

<script>

import { mapState } from 'vuex';
import colours from 'colors.css';

const size = {
	width: 110,
	height: 70,
};

const cols = 4;

export default {

	props: {
		service: Object,
		dimensions: Object,
		index: Number,
	},

	data() {
		return {
			'hover': false
		}
	},

	computed: {

		...mapState('app', ['options']),

		groupConfig() {

			var row = 0,
				col = 0;

			col = (this.index % cols);
			row = Math.floor(this.index / cols);

			let x = 0;
			let y = 30;

			x += col * (size.width + 10);
			y += row * (size.height + 10);

			x += 15;
			y += 10;

			return {
				x: x,
				y: y,
			};
		},

		rect() {
			return {
				x: 0,
				y: 0,
				width: size.width,
				height: size.height,
				cornerRadius: size.height / 4,
				// stroke: colours.black,
				strokeWidth: 1,
				stroke: this.hover && this.service.url ? colours.olive : colours.black,
			}
		},

		label() {
			return {
				x: 0,
				y: 0,
				width: size.width,
				height: size.height,
				padding: 5,
				text: this.service.label,
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
		launchUrl() {
			this.$refs.link.click();
		},
		onMousemove(e) {
			this.hover = true;
		},
		onMouseout() {
			this.hover = false;
		},
	}

}
</script>
