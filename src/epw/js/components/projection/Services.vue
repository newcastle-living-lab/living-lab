<template>

	<v-group :config="groupConfig">
		<v-rect ref="border" :config="border" />
		<v-text ref="label" :config="label" />

		<shape-service v-for="(service, index) in services"
			:key="service.id"
			:service="service"
			:dimensions="dimensions"
			:index="index"
		/>
	</v-group>

</template>

<script>

import { mapState } from 'vuex';
import colours from 'colors.css';

import ShapeService from './Service.vue';

export default {

	components: {
		ShapeService,
	},

	props: {
		dimensions: Object,
	},

	computed: {

		...mapState('app', ['options']),

		...mapState('project', {
			projectData: state => state.project.data,
			services: state => state.project.data.services,
		}),

		groupConfig() {
			let pos = {
				x: 0,
				y: 0,
				width: 510,
				height: 210,
			};

			if (this.dimensions.servicesGroup) {
				pos = this.dimensions.servicesGroup;
			};

			return pos;
		},

		label() {
			return {
				x: 0,
				y: 0,
				width: 510,
				text: typeof this.projectData.servicesLabel == 'string' ? this.projectData.servicesLabel : '',
				fontSize: 14,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				align: 'left',
				padding: 10,
			}
		},

		border() {
			return {
				x: 0,
				y: 0,
				width: 510,
				height: 210,
				stroke: colours.black,
				strokeWidth: 1
			}
		}

	}

}
</script>
