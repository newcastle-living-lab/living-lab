<template>

	<v-group>
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
/*
	data() {
		return {
			calculatedDims: {
				border: { x : 0, y: 0, width: 0, height: 0 },
				label: { x : 0, y: 0, width: 0, height: 0 },
			}
		}
	},*/

	props: {
		dimensions: Object,
	},

	computed: {

		...mapState('project', {
			projectData: state => state.project.data,
			services: state => state.project.data.services,
		}),

		label() {

			let pos = {
				x: 0,
				y: 0,
				width: 510 - 10 - 10,
			};

			if (this.dimensions.servicesLabel) {
				pos = this.dimensions.servicesLabel;
			};

			return {
				x: pos.x,
				y: pos.y,
				width: pos.width,
				text: typeof this.projectData.servicesLabel == 'string' ? this.projectData.servicesLabel : '',
				fontSize: 14,
				fontStyle: 'bold',
				lineHeight: 1.3,
				align: 'center',
			}
		},

		border() {

			let pos = {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
			};

			if (this.dimensions.servicesBorder) {
				pos = this.dimensions.servicesBorder;
			};

			return {
				x: pos.x,
				y: pos.y,
				width: pos.width,
				height: pos.height,
				stroke: colours.orange,
				strokeWidth: 1
			}
		}

	}

}
</script>
