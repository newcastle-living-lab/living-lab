<template>

	<v-group
		ref="group"
		:config="groupConfig"
		@mousemove="mousemove"
		@mouseout="mouseout"
		@click="launchUrl"
		@tap="launchUrl"
	>
		<!-- <v-ellipse ref="circle" :config="circleConfig" /> -->
		<CosmosStakeholderIcon ref="icon" v-bind="iconConfig" />
		<v-text ref="label" :config="labelConfig" />
		<a :href="url" target="_blank" ref="link"></a>
	</v-group>

</template>

<script>

import { get, commit } from 'vuex-pathify';

import colours from 'colors.css';
import CosmosStakeholderIcon from './CosmosStakeholderIcon';

export default {

	tween: null,

	name: 'CosmosStakeholder',

	components: {
		CosmosStakeholderIcon,
	},

	props: {
		aspectId: String,
		options: Object,
		definitionName: String,
		config: Object,
	},

	data() {
		return {
			pos: {
				width: 100,
				icon: 70,
			},
			circlePos: {
				x: 50,
				y: 45,
				radius: {
					x: 45,
					y: 45,
				}
			}
		}
	},

/*	watch: {
		'value': 'refreshPositions',
	},*/

	computed: {

		...get(['userGuide']),

		dataPath() {
			if (this.userGuide.isOpen) {
				return `userGuide@project.data.${this.aspectId}`;
			} else {
				return `project@data.${this.aspectId}`;
			}
		},

		aspectData: get(':dataPath'),

		model() {
			return this.aspectData && this.aspectData[this.definitionName] ? this.aspectData[this.definitionName] : {};
		},

		isVisible() {

			if (typeof(this.config.group.visible) !== 'undefined') {
				return this.config.group.visible;
			}

			return this.model.label
				&& this.model.label.length > 0
				? true : false;
		},

		url() {
			return this.model.url ? this.model.url : false;
		},

		groupConfig() {
			return {
				visible: this.isVisible,
				opacity: 1,
				x: this.config.group.x,
				y: this.config.group.y
			}
		},

		iconConfig() {
			return {
				x: 0,
				y: 0,
				colour: this.model.colour,
				type: this.model.type,
				width: this.pos.width,
				size: this.pos.icon,
			};
		},

		// circleConfig() {
		// 	return {
		// 		visible: this.circle && this.value.label ? true : false,
		// 		x: this.circlePos.x,
		// 		y: this.circlePos.y,
		// 		radius: this.circlePos.radius,
		// 		stroke: colours.olive,
		// 		strokeWidth: 3,
		// 		fill: '#ffffff',
		// 	}
		// },

		labelConfig() {

			var label = this.model ? this.model.label : '';

			var config = {
				text: label,
				fontSize: 13,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				x: 0,
				y: this.pos.icon + 30,
				width: this.pos.width,
				padding: 0,
				align: 'center',
			}

			return config;
		},

	},

	methods: {

		mousemove() {
			if (this.url) {
				commit('START_STAGE_HOVER');
			}
		},

		mouseout() {
			if (this.url) {
				commit('STOP_STAGE_HOVER');
			}
		},

		launchUrl() {
			if (this.url) {
				this.$refs.link.click();
			}
		},

		// refreshPositions() {
		// 	if ( ! this.circle) {
		// 		return;
		// 	}
		// 	this.$nextTick(() => {

		// 		let labelHeight = 15;
		// 		let iconHeight = 70;

		// 		if (nodeRefs.label && nodeRefs.icon && this.value.label && this.value.type) {
		// 			labelHeight = nodeRefs.label.getNode().getClientRect().height;
		// 			iconHeight = nodeRefs.icon.getNode().getClientRect().height;
		// 		}

		// 		this.circlePos = {
		// 			x: this.pos.width / 2,
		// 			y: Math.floor((iconHeight + labelHeight) / 2),	//Math.floor((this.pos.icon + labelHeight) / 2),
		// 			radius: {
		// 				x: this.pos.width * 0.75,
		// 				y: (iconHeight + 15),
		// 			}
		// 		}

		// 	});
		// }
	}

}
</script>
