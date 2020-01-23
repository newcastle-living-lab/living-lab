<template>

	<div>

		<h3 class="sidebar-heading">Projects</h3>

		<ul class="menu simple-menu">
			<li class="menu-item"
				v-for="project in projects"
				:key="project.id"
			>
				<router-link :to="'/' + project.id + '/livinglab'">{{ project.name }}</router-link>
			</li>
		</ul>

	</div>

</template>

<script>

import { mapState, mapActions } from 'vuex';

export default {

	computed: mapState('projects', {
		projects: 'all'
	}),

	activated() {
		// this.$router.push('/').catch((e) => {});
	}

}
</script>
