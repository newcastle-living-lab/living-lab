<template>

	<section class="project-toolbar">

		<nav class="navbar">

			<section class="navbar-section navbar-project">

			<section class="navbar-section navbar-tabs">
				<span v-if="hasProject" class="btn btn-link text-bold btn-empty mr-2">{{ project.name }}</span>
				<div v-if="hasProject">
					<router-link :to="urls.dashboard" class="btn btn-sm btn-link">Dashboard</router-link>
					<router-link :to="urls.theoryofchange" class="btn btn-sm btn-link">Theory of Change</router-link>
					<router-link :to="urls.communityreporting" class="btn btn-sm btn-link">Community Reporting</router-link>
					<router-link :to="urls.social" class="btn btn-sm btn-link">Social Media</router-link>
					<router-link :to="urls.livinglabmodels" class="btn btn-sm btn-link">Living Lab Models</router-link>
				</div>
			</section>

				<div v-if="hasProject" class="input-group input-inline ml-8">
					<label class="form-switch">
						<input type="checkbox" v-model="scale">
						<i class="form-icon"></i> <span class="text-small text-gray">Scale to fit</span>
					</label>
				</div>
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

			urls(state) {

				let id = state.project.id;

				return {
					dashboard: `/${id}/dashboard`,
					social: `/${id}/social`,
					theoryofchange: `/${id}/theory-of-change`,
					communityreporting: `/${id}/community-reporting`,
					livinglabmodels: `/${id}/living-lab-models`,
				}
			},

			hasProject(state) {
				return state.project && state.project.id
			},

		}),

		loginUrl() {
			return '/login?ref=' + encodeURIComponent(`${top.location.pathname}${top.location.hash}`);
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
