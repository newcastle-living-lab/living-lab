<template>
	<div class="app-sidebar">
		<keep-alive>
			<component v-bind:is="currentView" v-bind="$props"></component>
		</keep-alive>
	</div>
</template>

<script>

import Vue from 'vue';

import Projects from './Sidebar/Projects';
import ProjectInfo from './Sidebar/ProjectInfo';
import EditProject from './Sidebar/EditProject';
import NewProject from './Sidebar/NewProject';

import {appStore} from '../store/app';
import {nodeStore} from '../store/nodes';

Vue.component('sidebar-projects', Projects);
Vue.component('sidebar-info', ProjectInfo);
Vue.component('sidebar-edit', EditProject);
Vue.component('sidebar-new', NewProject);

export default {

	props: {
		view: String,
		projects: Array,
		project: Object
	},

	data() {
		return {
			app: appStore.state,
			nodes: nodeStore.state
		}
	},

	computed: {
		currentView: function() {
			return `sidebar-${this.view}`;
		}
	},

	methods: {
		onSave() {
			this.$emit('onSave');
		}
	}

}
</script>
