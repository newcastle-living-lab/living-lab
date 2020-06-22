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

export default {

	name: 'CosmosGroup',

	props: {
		config: Object,
		children: Array,
		definitionName: String,
		options: Object
	},

	computed: {

		groupConfig() {
			return {
				x: this.config.x,
				y: this.config.y,
			};
		}

	}

}
</script>
