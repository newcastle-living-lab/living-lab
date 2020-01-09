<template>

	<div>

		<h3 class="sidebar-heading">Enterprise Projection Wizard</h3>

		<div class="sidebar-content">
			<p class="text-center">
				To get started, create a <a href="javascript:;" @click="doNew" class="text-bold">New Project</a> or
				<a href="javascript:;" @click="doOpen" >Open an existing project</a>.
			</p>
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
}

</script>
