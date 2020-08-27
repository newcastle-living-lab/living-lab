<template>

	<div class="scrollable scr-y">

		<div
			v-for="(item, idx) in menuItems"
			class="tile tile-centered tile-template"
			:class="item.aspectConfig.id == aspectId ? 'active' : ''"
		>
			<div class="tile-content">
				<router-link
					:to="item.labelRoute"
					class="tile-title"
					tag="a"
				>{{ item.label }}</router-link>
			</div>
			<div class="tile-action" v-if="item.summaryRoute">
				<router-link :to="item.summaryRoute" tag="a" class="btn btn-action btn-link"><info-icon size="16" /></router-link>
			</div>
			<div class="tile-action" v-if="isEditable">
				<button class="btn btn-action btn-link" @click.prevent="doEdit(item.aspectConfig.id)"><edit-icon size="16" /></button>
			</div>
		</div>

	</div>

</template>

<script>

import { get, set, sync, call, commit } from 'vuex-pathify';

import map from 'lodash/map';
import findIndex from 'lodash/findIndex';

import EditIcon from 'vue-feather-icons/icons/SettingsIcon';
import InfoIcon from 'vue-feather-icons/icons/InfoIcon';

import Aspects from '@/aspects';

export default {

	components: {
		EditIcon,
		InfoIcon,
	},

	props: {
		aspectId: String,
	},

	data() {
		return {
		}
	},

	computed: {

		...get([
			'userCanEdit',
			'project',
		]),

		isEditable() {
			return (this.userCanEdit);
		},

		/**
		 * Get available menu items based on the aspects available.
		 *
		 */
		menuItems() {

			if ( ! Aspects.all()) {
				return [];
			}

			var tabs = map(Aspects.all(), (aspectConfig) => {

				var labelRoute = null,
					summaryRoute = null;

				if (aspectConfig.routeName == 'project') {
					aspectConfig.title = this.project.name;
				}

				labelRoute = {
					name: aspectConfig.routeName,
					params: {...this.$route.params, aspectId: aspectConfig.id }
				};

				if (aspectConfig.summaryComponent) {
					summaryRoute = {
						name: 'summary',
						params: { ...this.$route.params, aspectId: aspectConfig.id }
					};
				}

				return {
					aspectConfig: aspectConfig,
					label: aspectConfig.title,
					labelRoute: labelRoute,
					summaryRoute: summaryRoute,
				};
			});

			return tabs;
		},

	},

	methods: {

		doEdit(aspectId) {
			commit('EDIT_ASPECT', aspectId);
		},

	}

}
</script>
