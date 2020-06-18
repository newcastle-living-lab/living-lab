<template>

	<div class="app-container" :class="[isEditing ? 'is-editing' : '', isLoading ? 'is-loading' : '']">

		<AppHeader :route="this.$route" />

		<LoadingBar :loading="isLoading" />

		<ToastMessage />

		<router-view></router-view>

	</div>

</template>

<script>

import { get, commit } from 'vuex-pathify';

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
			'isEditing',
			'isLoading'
		]),

		currentRoute: function() {
			return this.$route
		},

	},

	created() {
		commit('SET_CONFIG', {...this.$root.$options.config});
	}

}
</script>

