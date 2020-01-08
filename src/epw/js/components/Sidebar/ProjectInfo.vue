<template>

	<div>

		<h3 class="sidebar-heading">Project Details</h3>

		{{ project.name }}

	</div>

</template>

<script>

import {appStore} from '../../store/app';
import {nodeStore} from '../../store/nodes';

export default {

	props: {
		project: Object,
	},

	data() {
		return {
			app: appStore.state,
			nodes: nodeStore.state
		}
	},

	methods: {
		onSave() {
			this.$emit('onSave');
		}
	}

}
</script>
