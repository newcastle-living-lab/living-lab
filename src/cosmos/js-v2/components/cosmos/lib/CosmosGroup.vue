<template>

	<v-group :config="groupConfig">
		<component
			v-for="(node, idx) in children"
			:key="idx"
			v-bind:is="node.componentName"
			:path="node.path"
			:ref="node.ref"
			:config="node.config"
			:children="node.children"
			:definitionName="node.definitionName"
			:options="options"
		></component>
	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';

import Templates from '@/templates';

export default {

	name: 'CosmosGroup',

	props: {
		config: Object,
		children: Array,
		definitionName: String,
		templateName: String,
		visibilityFunc: String,
		options: Object
	},

	computed: {

		projectData: get('project@data'),

		isVisible() {
			if (typeof(this.visibilityFunc) === 'undefined') {
				return true;
			}

			if ( ! this.templateName) {
				return true;
			}

			var fns = Templates.get(this.templateName)['Functions'];
			var hasFns = (typeof(fns) == 'object');
			var hasFn = hasFns && (typeof(fns[this.visibilityFunc]) == 'function');
			if ( ! hasFn) {
				return true;
			}

			var res = fns[this.visibilityFunc](this.definitionName, this.projectData);
			return res;
		},

		groupConfig() {
			return {
				visible: this.isVisible,
				x: this.config.x,
				y: this.config.y,
			};
		}

	}

}
</script>
