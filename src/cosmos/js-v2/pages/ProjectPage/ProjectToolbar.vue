<template>

	<section class="project-toolbar">

		<nav class="navbar">

			<section class="navbar-section navbar-tabs">
				<span v-if="project.id" class="btn btn-link text-bold btn-empty mr-2">{{ project.name }}</span>
				<div v-if="project.id">
					<router-link
						v-for="(tab, idx) in filteredTabs"
						:key="idx"
						:to="tab.to"
						class="btn btn-sm btn-link"
					>{{ tab.label }}</router-link>
				</div>
			</section>

			<section class="navbar-section navbar-project">
				<div v-if="project" class="input-group input-inline ml-8">
					<label class="form-switch" v-show="activeTab == 'dashboard'">
						<input type="checkbox" v-model="scale">
						<i class="form-icon"></i> <span class="text-small text-gray">Scale to fit</span>
					</label>
				</div>
			</section>

		</nav>

	</section>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

import filter from 'lodash/filter';
import map from 'lodash/map';
import indexOf from 'lodash/indexOf';

import Templates from '@/templates';

export default {

	computed: {

		...get([
			'project',
		]),

		...sync([
			'scale',
		]),


		template() {
			if ( ! this.project.id) {
				return false;
			}
			return Templates.get(this.project.template);
		},

		templateTabs() {
			if ( ! this.template) {
				return [];
			}
			return this.template.CONFIG.tabs;
		},

		/**
		 * Get available tabs based on features of the template.
		 *
		 */
		filteredTabs() {

			if ( ! this.templateTabs) {
				return [];
			}

			var tabs = map(this.templateTabs, (tab) => {
				var to = null;
				if (tab.route === 'dashboard') {
					to = { name: 'dashboard', params: this.$route.params };
				} else {
					to = { name: 'template-tab', params: {...this.$route.params, tab: tab.route }};
				};
				return {
					label: tab.label,
					to: to
				};
			});

			// If only one tab: don't show any
			if (tabs.length === 1) {
				return [];
			}

			return tabs;

		},

		activeTab: function() {
			return this.$route.name;
		}

	}

}
</script>
