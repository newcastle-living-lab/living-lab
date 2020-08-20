<template>

	<main ref="container" class="app-content light welcome">
		<div class="container grid-xl">
			WELCOME TO THE PROJECT "{{ project.name }}"
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
