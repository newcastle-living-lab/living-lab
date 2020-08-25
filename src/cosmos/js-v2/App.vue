<template>

	<div class="app-container" :class="[aspectEditId ? 'is-editing' : '', isLoading ? 'is-loading' : '']">

		<AppHeader :route="this.$route" />

		<LoadingBar :loading="isLoading" />

		<ToastMessage />

		<router-view></router-view>

	</div>

</template>

<script>

import { get, commit, call, dispatch } from 'vuex-pathify';

import Network from "./services/Network";
import AppHeader from "./components/layout/AppHeader.vue";
import LoadingBar from "./components/layout/LoadingBar.vue";
import ToastMessage from "./components/layout/ToastMessage.vue";

export default {

	components: {
		AppHeader,
		LoadingBar,
		ToastMessage,
	},

	computed: {

		...get([
			'aspectEditId',
			'isLoading',
			'project',
			'lastSave',
		]),

		currentRoute: function() {
			return this.$route
		},

	},

	watch: {
		'project': {
			handler: function() {
				this.doAutoSave();
			},
			deep: true,
		}
	},

	methods: {
		doAutoSave: call('doAutoSave'),
	},

	created() {
		commit('SET_CONFIG', {...this.$root.$options.config});
		commit('INIT_USER_GUIDE_PROJECT');
	}

}
</script>

