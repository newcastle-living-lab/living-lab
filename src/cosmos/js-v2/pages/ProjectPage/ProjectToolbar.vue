<template>

	<section class="project-toolbar">

		<nav class="navbar">

			<section class="navbar-section navbar-tabs">
				<span v-if="project" class="btn btn-link text-bold btn-empty mr-2">{{ project.name }} ({{ modelTitle }})</span>
				<div v-if="project">
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
					<label class="form-switch">
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

import TemplateHelper from '@/helpers/Template';

export default {

	computed: {

		...get([
			'project',
		]),

		...sync([
			'scale',
		]),

		modelTitle: get('project@data.model.title'),

		/**
		 * Get available tabs based on features of the template.
		 *
		 */
		filteredTabs() {

			var tabs = [
				{ feature: 'dashboard', label: 'Dashboard', route: 'dashboard' },
				{ feature: 'theory_of_change', label: 'Theory of Change', route: 'theory_of_change' },
				{ feature: 'community_reporting', label: 'Community Reporting', route: 'community_reporting' },
				{ feature: 'social_media', label: 'Social Media', route: 'social_media' },
				{ feature: 'living_lab_models', label: 'Living Lab Models', route: 'living_lab_models' },
			];

			// Get tabs for the template's features
			tabs = filter(tabs, (tab) => this.hasFeature(tab.feature));

			// Return object with name + route `to` param
			tabs = map(tabs, (tab) => {
				return {
					label: tab.label,
					to: { name: tab.route, params: this.$route.params },
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

	},

	methods: {
		hasFeature(featureName) {
			return TemplateHelper.hasFeature(this.project.template, featureName);
		}
	}

}
</script>
