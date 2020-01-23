<template>

	<v-group :config="groupConfig">
		<v-ellipse ref="circle" :config="circleConfig" />
		<v-text ref="label" :config="label" />
		<service-type-icon ref="icon" v-bind="icon" />
	</v-group>

</template>

<script>

import { mapState } from 'vuex';
import colours from 'colors.css';
import ServiceTypeIcon from './ServiceTypeIcon.vue';

let nodeRefs = {};

export default {

	components: {
		ServiceTypeIcon,
	},

	props: {
		prop: String,
		x: Number,
		y: Number,
		circle: Boolean,
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

	watch: {
		'value': 'refreshPositions',
	},

	computed: {

		...mapState('app', ['options']),

		...mapState('project', {
			projectData: state => state.project.data
		}),

		value() {
			return this.$store.getters[`project/${this.prop}`];
		},

		groupConfig() {
			return {
				x: this.x,
				y: this.y
			}
		},

		circleConfig() {
			return {
				visible: this.circle && this.value.label ? true : false,
				x: this.circlePos.x,
				y: this.circlePos.y,
				radius: this.circlePos.radius,
				stroke: colours.olive,
				strokeWidth: 3,
				fill: '#ffffff',
			}
		},

		label() {
			return {
				text: this.value.label,
				fontSize: 12,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				x: 0,
				y: this.pos.icon + 15,
				width: this.pos.width,
				padding: 0,
				align: 'center',
			}
		},

		icon() {
			return {
				x: 0,
				y: 0,
				colour: this.value.colour,
				type: this.value.type,
				width: this.pos.width,
				size: this.pos.icon,
			};
		}

	},

	methods: {
		refreshPositions() {
			if ( ! this.circle) {
				return;
			}
			this.$nextTick(() => {

				let labelHeight = 15;
				let iconHeight = 70;

				if (nodeRefs.label && nodeRefs.icon && this.value.label && this.value.type) {
					labelHeight = nodeRefs.label.getNode().getClientRect().height;
					iconHeight = nodeRefs.icon.getNode().getClientRect().height;
				}

				this.circlePos = {
					x: this.pos.width / 2,
					y: Math.floor((iconHeight + labelHeight) / 2),	//Math.floor((this.pos.icon + labelHeight) / 2),
					radius: {
						x: this.pos.width * 0.75,
						y: (iconHeight + 15),
					}
				}

			});
		}
	},

	mounted() {
		nodeRefs.label = this.$refs.label;
		nodeRefs.icon = this.$refs.icon.$refs.group;
		this.refreshPositions();
	}

}
</script>
