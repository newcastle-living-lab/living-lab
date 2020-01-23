<template>

	<v-group :config="groupConfig">
		<v-rect ref="border" :config="border" />
		<v-text ref="label" :config="label" />

		<shape-service v-for="(item, index) in filteredServices"
			:key="item.id"
			:item="item"
			:index="index"
			:colour="colour"
		/>
	</v-group>

</template>

<script>

import { mapState, mapGetters } from 'vuex';
import colours from 'colors.css';

import ShapeService from './Service.vue';

export default {

	components: {
		ShapeService,
	},

	props: {
		dimensions: Object,
		type: String,
		labelProp: String,
		colour: String,
	},

	computed: {

		...mapState('app', ['options']),

		...mapState('project', {
			projectData: state => state.project.data,
		}),

		...mapGetters('project', ['services']),

		filteredServices() {
			return this.services.filter(item => item.type == this.type);
		},

		labelValue() {
			return this.projectData[this.labelProp] ? this.projectData[this.labelProp] : '';
		},

		groupConfig() {
			let pos = {
				x: 0,
				y: 0,
				width: 510,
				height: 210,
			};

			if (this.dimensions[this.type + "Group"]) {
				pos = this.dimensions[this.type + "Group"];
			};

			return pos;
		},

		label() {
			return {
				x: 0,
				y: 0,
				width: 510,
				text: this.labelValue,
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
