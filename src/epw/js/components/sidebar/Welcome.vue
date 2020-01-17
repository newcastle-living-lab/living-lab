<template>

	<div>

		<h3 class="sidebar-heading">Enterprise Projection Wizard</h3>

		<div class="sidebar-content">
			<p class="text-center mt-4 mb-4">To get started, choose one of the options below.</p>
			<button @click="doNew" class="mb-2 btn btn-block btn-primary">New Project</button>
			<button @click="doOpen" class="mb-2 btn btn-block btn-primary">Open Project</button>
		</div>

	</div>

</template>

<script>

import { mapState, mapActions } from 'vuex';

export default {
	methods: mapActions('app', [
		'doNew',
		'doOpen',
	]),

	activated() {
		// this.$router.push('/').catch((e) => {});
	}
}

</script>
