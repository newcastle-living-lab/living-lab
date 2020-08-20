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
		aspectId: String,
		options: Object,
	},

	computed: {


		dataPath() {
			return `project@data.${this.aspectId}`;
		},

		aspectData: get(':dataPath'),

		model() {
			return this.aspectData && this.aspectData.model ? this.aspectData.model : {};
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
				fontSize: 24,
				// fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				x: 20,
				y: 20,
				width: 800,
			};
			return Object.assign({}, defaultConfig, this.config);
		}

	}

}
</script>
