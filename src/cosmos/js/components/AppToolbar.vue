<template>

	<section class="app-toolbar">

		<nav class="navbar">

			<section class="navbar-section navbar-buttons">

				<button class='btn btn-secondary navbar-brand btn-sm mr-4'
					@click="doWelcome"
				>{{ appName }}</button>

				<button class='btn btn-link btn-sm'
					@click="doNew"
					v-if="userCanEdit"
				><plus-icon size="16" />New</button>

				<button class='btn btn-link btn-sm'
					@click="doOpen"
				><folder-icon size="16" />Open...</button>

				<button class='btn btn-link btn-sm'
					v-if="hasProject && userCanEdit"
					@click="doEdit"
				><edit-icon size="16" />Edit</button>

				<button class='btn btn-link btn-sm'
					v-if="hasProject && userCanEdit"
					@click="saveProject"
				><save-icon size="16" />Save</button>

			</section>

			<section class="navbar-section navbar-tabs">
				<span v-if="hasUser"
					class="btn btn-empty btn-sm"
				><user-icon size="16" /> {{ user.username }}</span>
				<a v-if="!hasUser && requireAuth"
					class="btn btn-link btn-sm"
					:href="loginUrl"
				><key-icon size="16" /> Log in</a>
			</section>

		</nav>

	</section>

</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';

import PlusIcon from 'vue-feather-icons/icons/PlusIcon';
import EditIcon from 'vue-feather-icons/icons/EditIcon';
import FolderIcon from 'vue-feather-icons/icons/FolderIcon';
import SaveIcon from 'vue-feather-icons/icons/SaveIcon';
import UserIcon from 'vue-feather-icons/icons/UserIcon';
import KeyIcon from 'vue-feather-icons/icons/KeyIcon';

export default {

	components: {
		PlusIcon,
		FolderIcon,
		EditIcon,
		SaveIcon,
		UserIcon,
		KeyIcon,
	},

	computed: {

		activeTab: function() {
			return this.$route.name;
		},

		...mapGetters('app', [
			'userCanEdit',
			'hasUser',
			'requireAuth',
			'user',
		]),

		...mapState('app', {
        	appName: 'appName',
        }),

		...mapFields('app', [
			'scale',
		]),

		...mapState('project', {

			project: 'project',

			projectionUrl(state) {
				return `/${state.project.id}/livinglab`;
			},

			socialUrl(state) {
				return `/${state.project.id}/social`;
			},

			hasProject(state) {
				return state.project && state.project.id
			},

		}),

		loginUrl() {
			let currentRoute = this.$route.path;
			let path = top.location.pathname.replace(currentRoute, '');
			return '/login?ref=' + encodeURIComponent(path + currentRoute);
		}

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
		]),

	}

}
</script>
