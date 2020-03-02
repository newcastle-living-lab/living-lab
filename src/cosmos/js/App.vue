<template>

	<div class="app-container" :class="editing ? 'is-editing' : ''">

		<Toast/>
		<AppToolbar/>
		<ProjectToolbar/>

		<section class="app-main">

			<Sidebar/>

			<keep-alive>
				<router-view></router-view>
			</keep-alive>

		</section>


	</div>

</template>

<script>

import Toast from './components/Toast';
import AppToolbar from './components/AppToolbar';
import ProjectToolbar from './components/ProjectToolbar';
import Sidebar from './components/Sidebar';

import { mapState, mapActions } from 'vuex';

export default {

	components: {
		AppToolbar,
		ProjectToolbar,
		Sidebar,
		Toast,
	},

	computed: {
		currentRoute: function() {
			return this.$route
		},
		...mapState('app', [
			'appName',
			'editing',
			'loading',
		]),
		...mapState('project', [
			'project',
		]),
	},

	watch: {
		'$route': 'onRouteChange',
		'project': 'updateTitle',
	},

	methods: {
		onRouteChange() {
			let id = this.$route.params.id;
			if (id && id != this.project.id) {
				this.$store.dispatch('projects/getProject', id);
			}
			if (typeof fathom !== 'undefined') {
				fathom('trackPageview');
			}
		},
		updateTitle() {
			if (this.project && this.project.name) {
				document.title = `${this.project.name} | ${this.appName} [Living Lab]`;
				return;
			}
			document.title = `${this.appName} [Living Lab]`;
		}
	},

	created() {
		this.$store.commit('app/setConfig', this.$root.$options.config);
		this.onRouteChange();
		this.updateTitle();
	}

}
</script>

