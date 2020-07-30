<template>

	<section class="app-header">

		<nav class="navbar">

			<section class="navbar-section navbar-buttons">

				<router-link to='/' class='navbar-brand btn btn-link'>{{ appName }}</router-link>

				<button class='btn btn-link btn-sm'
					v-if="hasProject && userCanEdit"
					@click="doEdit"
				><edit-icon size="16" />Edit</button>

				<button class='btn btn-link btn-sm'
					v-if="hasProject && userCanEdit"
					@click="doSave"
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

import { get, commit, dispatch } from 'vuex-pathify';

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

	props: ['route'],

	computed: {

		...get([
			'appName',
			'isEditing',
			'userCanEdit',
			'hasUser',
			'requireAuth',
			'user',
		]),

		hasProject() {
			return (this.route && this.route.params.id);
		},

		loginUrl() {
			let currentRoute = this.route.path;
			let path = top.location.pathname.replace(currentRoute, '');
			let uri = path + currentRoute;
			uri = uri.replace('//', '/');
			return '/login?ref=' + encodeURIComponent(uri);
		}

	},

	methods: {

		doEdit() {
			if (!this.isEditing)  {
				commit('START_EDITING');
			} else {
				commit('STOP_EDITING');
			}
		},

		doSave() {
			dispatch('saveProject', 'manual');
		}

	}

}
</script>
