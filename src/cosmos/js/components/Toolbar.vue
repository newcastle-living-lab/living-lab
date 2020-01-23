<template>

	<section class="app-toolbar">

		<nav class="navbar">

			<section class="navbar-section navbar-buttons">

				<button class='btn btn-primary navbar-brand mr-4'
					@click="doWelcome"
				>{{ appName }}</button>

				<button class='btn btn-link'
					@click="doNew"
				><plus-icon size="16" />New</button>

				<button class='btn btn-link'
					@click="doOpen"
				><folder-icon size="16" />Open...</button>

				<button class='btn btn-link'
					v-if="hasProject"
					@click="doEdit"
				><edit-icon size="16" />Edit</button>

				<button class='btn btn-link'
					v-if="hasProject"
					@click="saveProject"
				><save-icon size="16" />Save</button>

			</section>

			<section class="navbar-section navbar-tabs">
				<div v-if="hasProject">
					<span v-if="hasProject" class="btn btn-link text-bold btn-empty mr-2">{{ project.name }}</span>
					<router-link :to="projectionUrl" class="btn btn-link" :class="activeTab == 'projection' ? 'active' : ''">Projection</router-link>
					<router-link :to="socialUrl" class="btn btn-link">Social Media</router-link>
				</div>
				<div v-if="hasUser" class="ml-16">
					<span class="chip user-chip">
						<span class="avatar avatar-sm"><user-icon size="16" /></span>
						{{ user.username }}
					</span>
					<!-- <span class="btn btn-link">{{ user.username }}</span> -->
				</div>
			</section>

		</nav>

	</section>

</template>

<script>

import { mapState, mapActions } from 'vuex';

import PlusIcon from 'vue-feather-icons/icons/PlusIcon';
import EditIcon from 'vue-feather-icons/icons/EditIcon';
import FolderIcon from 'vue-feather-icons/icons/FolderIcon';
import SaveIcon from 'vue-feather-icons/icons/SaveIcon';
import UserIcon from 'vue-feather-icons/icons/UserIcon';

export default {

	components: {
		PlusIcon,
		FolderIcon,
		EditIcon,
		SaveIcon,
		UserIcon,
	},

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
