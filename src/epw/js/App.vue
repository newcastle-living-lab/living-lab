<template>

	<div class="app-container" :class="editing ? 'is-editing' : ''">

		<Toast/>
		<Toolbar/>

		<section class="app-main">

			<Sidebar/>

			<main class="app-content">
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</main>

		</section>


	</div>

</template>

<script>

import Toast from './components/Toast';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';

import { mapState, mapActions } from 'vuex';

export default {

	components: {
		Toolbar,
		Sidebar,
		Toast,
	},

	computed: {
		currentRoute: function() {
			return this.$route
		},
		...mapState('app', [
			'editing',
			'loading',
		])
	},

	watch: {
		'$route': 'fetchProject'
	},

	methods: {
		fetchProject() {
			if ( ! this.$route.params.id) {
				return;
			}
			this.$store.dispatch('projects/getProject', this.$route.params.id);
		}
	},

	created() {
		this.$store.commit('app/setUser', this.$root.$options.user);
		this.fetchProject();
	}

}
</script>

