<template>

	<div class="app-container" :class="editing ? 'is-editing' : ''">

		<Toolbar/>

		<section class="app-main">

			<Sidebar/>

			<div class="app-content">
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</div>

		</section>


	</div>

</template>

<script>

import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';

import { mapState, mapActions } from 'vuex';

export default {

	components: {
		Toolbar,
		Sidebar,
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

