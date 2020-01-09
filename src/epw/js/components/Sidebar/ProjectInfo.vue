<template>

	<div>

		<h3 class="sidebar-heading">Project Details</h3>

		<div class="sidebar-content">
			<h5>{{ currentProject.name }}</h5>
			<!-- <p>{{ currentProject.created_at }}</p>
			<p>{{ currentProject.modified_at }}</p>
			<p>{{ currentProject.created_by }}</p> -->
		</div>

	</div>

</template>

<script>

import { mapState, mapActions } from 'vuex';

export default {

	computed: {
		...mapState('projects', ['currentProject']),
	}

}
</script>
