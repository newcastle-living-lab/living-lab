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
			:aspectId="aspectId"
		></component>
	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';

export default {

	name: 'CosmosGroup',

	props: {
		aspectId: String,
		config: Object,
		children: Array,
		definitionName: String,
		visibilityFunc: String,
		options: Object
	},

	computed: {

		dataPath() {
			return `project@data.${this.aspectId}`;
		},

		aspectData: get(':dataPath'),

		isVisible() {
			if (typeof(this.visibilityFunc) === 'undefined') {
				return true;
			}

			if ( ! this.aspectId) {
				return true;
			}

			var fns = Aspects.get(this.aspectId)['Functions'];
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
