<template>

	<v-group>
		<v-text :config="titleConfig"/>
	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';

export default {

	name: 'CosmosTitle',

	props: {
		options: Object,
		definitionName: String,
		config: Object,
	},

	computed: {

		projectData: get('project@data'),

		model() {
			return this.projectData && this.projectData.model ? this.projectData.model : {};
		},

		isVisible() {
			return this.model.title
				&& this.model.title.length > 0
				? true : false;
		},

		titleConfig() {
			var defaultConfig = {
				visible: this.isVisible,
				visible: true,
				text: this.model ? this.model.title : '',
				fontSize: 30,
				// fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				x: 20,
				y: 20,
				width: 400,
			};
			return Object.assign({}, defaultConfig, this.config);
		}

	}

}
</script>
