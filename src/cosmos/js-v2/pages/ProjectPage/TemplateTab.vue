<template>

	<component
		v-bind:is="componentName"
		v-if="componentName"
	></component>

</template>

<script>

import find from 'lodash/find';
import { get, set, sync, call } from 'vuex-pathify';

import Templates from '@/templates';

export default {

	props: {
		tab: String
	},

	computed: {

		template() {
			if ( ! this.project.id) {
				return false;
			}
			var template = Templates.get(this.project.template);
			return template;
		},

		tabConfig() {
			if ( ! this.template) {
				return false;
			}

			return find(this.template.CONFIG.tabs, { route: this.tab });
		},

		componentName() {
			return this.tabConfig.component;
		},

		...get([
			'project',
		]),
	}

}

</script>

<style scoped>
pre {
	background: #fff;
	font-size: 80%;
}
</style>
