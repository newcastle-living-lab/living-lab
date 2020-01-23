<template>

	<div>

		<h3 class="sidebar-heading">Living Lab</h3>

		<div class="sidebar-content">
			<h5>{{ project.name }}</h5>
		</div>

	</div>

</template>

<script>

import { mapState, mapActions } from 'vuex';

export default {

	computed: {
		...mapState('project', ['project']),
	}

}
</script>
