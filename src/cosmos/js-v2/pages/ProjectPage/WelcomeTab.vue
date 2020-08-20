<template>

	<main ref="container" class="app-content light welcome">
		<div class="container grid-xl">
			<div class="empty">
					<p class="empty-title h5">{{ project.name }}</p>
					<p class="empty-subtitle" v-if="project.created_by">Created by {{ project.created_by }} on {{ project.created_at }}</p>
				</div>
		</div>
	</main>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

export default {

	computed: {
		...get([
			'project',
		]),
	}

}

</script>
