<template>

	<component
		v-bind:is="componentName"
		v-if="componentName"
		:aspectId="aspectId"
	></component>

</template>

<script>

import find from 'lodash/find';
import { get, set, sync, call } from 'vuex-pathify';

import Aspects from '@/aspects';

export default {

	props: {
		aspectId: [Boolean, String],
	},

	computed: {

		/**
		 * Get aspect (ALL data - CONFIG + DEFS etc!) based on supplied editor ID
		 *
		 */
		aspect() {
			const aspect = this.aspectId;
			if ( ! this.aspectId) {
				return null;
			}
			return Aspects.get(aspect);
		},

		aspectConfig() {
			if ( ! this.aspect) {
				return false;
			}

			return this.aspect.CONFIG;
		},

		componentName() {
			return this.aspectConfig.componentName;
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
