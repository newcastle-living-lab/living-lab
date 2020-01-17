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
					v-if="hasProject"
					@click="doEdit"
				>Edit</button>

				<button class='btn btn-link'
					v-if="hasProject"
					@click="saveProject"
				>Save</button>

			</section>

			<section class="navbar-section">
				<div v-if="hasProject">
					<span v-if="hasProject" class="btn btn-link text-bold mr-2">{{ project.name }}</span>
					<router-link :to="projectionUrl" class="btn btn-link" :class="activeTab == 'projection' ? 'active' : ''">Projection</router-link>
					<router-link :to="socialUrl" class="btn btn-link">Social Media</router-link>
				</div>
				<div v-if="hasUser" class="ml-16">
					<span class="btn btn-link">{{ user.username }}</span>
				</div>
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
		...mapState('app', {
        	appName: 'appName',
        	user: 'user',
        	hasUser(state) {
        		return state.user && state.user.username
        	}
        }),
		...mapState('project', {
			project: 'project',
			projectionUrl(state) {
				return `/${state.project.id}/projection`;
			},
			socialUrl(state) {
				return `/${state.project.id}/social`;
			},
			hasProject(state) {
				return state.project && state.project.id
			},
		}),

	},

	methods: {
		...mapActions('app', [
			'doWelcome',
			'doNew',
			'doOpen',
			'doEdit',
		]),
		...mapActions('project', [
			'saveProject',
		])
	}

}
</script>
