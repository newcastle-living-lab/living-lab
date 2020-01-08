<template>

	<div class="app-container" :class="editing ? 'is-editing' : ''">

		<Toolbar
			@onEdit="onEdit"
			@onOpen="onOpen"
			@onNew="onNew"
			:project="project"
		/>

		<section class="app-main">

			<Sidebar
				:view="sidebarView"
				:projects="projects"
				:project="project"
				@onSave="onSave"
			/>

			<div class="app-content">
				{{ currentRoute.params.id }}
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</div>

		</section>


	</div>

</template>

<script>

import {appStore} from './store/app';
import {nodeStore} from './store/nodes';

import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import Stage from './components/Stage';

export default {

	components: {
		Toolbar,
		Sidebar,
		Stage,
	},

	computed: {
		currentRoute: function() {
			return this.$route
		}
	},

	data() {
		return {
			editing: false,
			app: appStore.state,
			nodes: nodeStore.state,
			projects: [],
			project: null,
			sidebarView: 'new',
		}
	},

	watch: {
		'$route': 'fetchProject'
	},

	methods: {
		onNew() {
			this.$router.push('/')
			this.sidebarView = 'new';
			// Prompt for details
			// Save to API
			// Get ID
			// Load ID /projection
		},
		onSave() {
			console.log(this.nodes);
			console.log(JSON.stringify(nodeStore.state));
			localStorage.setItem('epw', JSON.stringify(nodeStore.state));
		},
		onEdit() {
			this.sidebarView = 'edit';
			this.editing = !this.editing;
		},
		onOpen() {
			this.sidebarView = 'projects';
			this.$api.getProjects().then(res => {
				this.projects = res;
			});
		},
		fetchProject() {
			this.error = this.project = null;
			this.loading = true;
			if (this.$route.params.id) {
				// this.sidebarView = 'info';
				this.$api.getProject(this.$route.params.id).then(res => {
					this.project = res;
					this.loading = false;
				});
			}
		}
	},

	created() {
		this.fetchProject();
	}

}
</script>

