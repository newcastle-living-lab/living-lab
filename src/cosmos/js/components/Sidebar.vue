<template>
	<aside class="app-sidebar">
		<div class="scrollable scr-y">
			<keep-alive>
				<component v-bind:is="currentView"></component>
			</keep-alive>
		</div>
	</aside>
</template>

<script>

import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

import Projects from './sidebar/Projects';
import ProjectInfo from './sidebar/ProjectInfo';
import EditProject from './sidebar/EditProject';
import NewProject from './sidebar/NewProject';
import Welcome from './sidebar/Welcome';

Vue.component('sidebar-projects', Projects);
Vue.component('sidebar-info', ProjectInfo);
Vue.component('sidebar-edit', EditProject);
Vue.component('sidebar-new', NewProject);
Vue.component('sidebar-welcome', Welcome);

export default {

	computed: mapState('app', {
		currentView(state) {
			return `sidebar-${state.sidebarView}`;
		}
	})

}
</script>
