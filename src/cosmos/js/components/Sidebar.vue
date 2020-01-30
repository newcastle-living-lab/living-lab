<template>
	<aside class="app-sidebar" v-show="showSidebar">
		<div class="scrollable scr-y">
			<keep-alive>
				<component v-bind:is="currentView"></component>
			</keep-alive>
		</div>
	</aside>
</template>

<script>

import Vue from 'vue';
import { mapState, mapGetters, mapActions } from 'vuex';

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

	computed: {

		...mapState('app', {

			sidebarView: 'sidebarView',

			currentView(state) {
				return `sidebar-${state.sidebarView}`;
			}
		}),

		...mapGetters('app', ['userCanEdit']),

		...mapState('project', ['project']),

		showSidebar() {

			if (this.userCanEdit) {
				return true;
			} else {
				if (this.sidebarView === 'welcome') {
					return this.project !== null;
				}
				if (this.sidebarView === 'projects') {
					return true;
				}
			}

			return false;
		}
	}

}
</script>
