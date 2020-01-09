<template>
	<div class="app-sidebar">
		<keep-alive>
			<component v-bind:is="currentView"></component>
		</keep-alive>
	</div>
</template>

<script>

import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

import Projects from './Sidebar/Projects';
import ProjectInfo from './Sidebar/ProjectInfo';
import EditProject from './Sidebar/EditProject';
import NewProject from './Sidebar/NewProject';
import Welcome from './Sidebar/Welcome';

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
