<template>

	<v-group>
		<v-text ref="label" :config="label" />
		<service-type-icon ref="icon" v-bind="icon" />
	</v-group>

</template>

<script>

import { mapState } from 'vuex';
import ServiceTypeIcon from './ServiceTypeIcon.vue';

export default {

	components: {
		ServiceTypeIcon,
	},

	props: {
		prop: String,
		x: Number,
		y: Number,
	},

	data() {
		return {
			pos: {
				width: 100,
				icon: 70,
			},
		}
	},

	computed: {

		...mapState('app', ['options']),

		...mapState('project', {
			projectData: state => state.project.data
		}),

		value() {
			return this.$store.getters[`project/${this.prop}`];
		},

		label() {
			return {
				text: this.value.label,
				fontSize: 12,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				x: this.x,
				y: this.y + this.pos.icon + 15,
				width: this.pos.width,
				padding: 0,
				align: 'center',
			}
		},

		icon() {
			return {
				x: this.x,
				y: this.y,
				colour: this.value.colour,
				type: this.value.type,
				width: this.pos.width,
				size: this.pos.icon,
			};
		}

	}

}
</script>
