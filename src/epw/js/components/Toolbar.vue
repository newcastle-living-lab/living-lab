<template>

	<section class="app-toolbar">

		<nav class="navbar">

			<section class="navbar-section">

				<button class='btn btn-primary navbar-brand mr-4'
					@click="doWelcome"
				>{{ appName }}</button>

				<button class='btn btn-link'
					@click="doNew"
				>New</button>

				<button class='btn btn-link'
					@click="doOpen"
				>Open...</button>

				<button class='btn btn-link'
					v-if="currentProject"
					@click="doEdit"
				>Edit</button>

			</section>

			<section class="navbar-section" v-if="currentProject">
				<span v-if="currentProject" class="btn btn-link text-bold mr-4">{{ currentProject.name }}</span>
				<router-link :to="projectionUrl" class="btn btn-link" :class="activeTab == 'projection' ? 'active' : ''">Projection</router-link>
				<router-link :to="socialUrl" class="btn btn-link">Social Media</router-link>
			</section>

		</nav>

	</section>

</template>

<script>

import { mapState, mapActions } from 'vuex';

export default {

	computed: {
		activeTab: function() {
			return this.$route.name;
		},
		...mapState('app', [
        	'appName',
		]),
		...mapState('projects', {
			currentProject: 'currentProject',
			projectionUrl(state) {
				return `/${state.currentProject.id}/projection`;
			},
			socialUrl(state) {
				return `/${state.currentProject.id}/social`;
			}
		}),

	},

	methods: mapActions('app', [
		'doWelcome',
		'doNew',
		'doOpen',
		'doEdit',
	]),

}
</script>
