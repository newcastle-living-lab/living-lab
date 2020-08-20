<template>

	<section class="project-toolbar">

		<nav class="navbar">

			<section class="navbar-section navbar-tabs">

				<ul class="tab" v-if="project.id">
					<router-link
						v-for="(tab, idx) in filteredTabs"
						:key="idx"
						:to="tab.to"
						class="tab-item"
						tag="li"
						active-class="active"
					><a>{{ tab.label }}</a></router-link>
				</ul>
			</section>

			<section class="navbar-section navbar-project">
				<div v-show="lastSave.waiting" class="input-group input-inline">
					<div class="text-gray text-small"><span class="loading mr-4"></span> <span>Saving...</span></div>
				</div>
				<div v-show="lastSavedString && ! lastSave.waiting" class="input-group input-inline">
					<span class="text-gray text-small">Last saved at {{ lastSavedString }}</span>
				</div>
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
import format from 'date-fns/format';

import filter from 'lodash/filter';
import map from 'lodash/map';
import indexOf from 'lodash/indexOf';

import Templates from '@/templates';

export default {

	computed: {

		...get([
			'project',
			'lastSave',
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
		},

		lastSavedString() {
			if (this.lastSave.time) {
				return format(this.lastSave.time, 'HH:mm');
			}
			return false;
		}

	}

}
</script>
