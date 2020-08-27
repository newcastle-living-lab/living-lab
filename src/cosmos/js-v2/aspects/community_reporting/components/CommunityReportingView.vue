<template>

	<main ref="container" class="app-content light community-reporting">
		<div class="container grid-xl">
			<h4 class="mb-8 mt-4">Community Reporting</h4>

			<div class="columns external-items" v-if="communityReporting.length > 0">
				<external-item
					v-for="(item, index) in communityReporting"
					:key="index"
					:item="item"
					type="comrep"
				/>
			</div>
			<div class="empty" v-if="!communityReporting.length">
				<p class="empty-title h5">There are no community reporting items for this project.</p>
				<div class="empty-action">
					<button class="btn btn-primary" v-show="userCanEdit" @click.prevent="doEdit">Manage Community Reporting</button>
				</div>
			</div>
		</div>
	</main>

</template>

<script>

import { get, commit } from 'vuex-pathify';

import ExternalItem from '@/components/project/view/ExternalItem';

export default {

	name: "CommunityReportingView",

	components: {
		ExternalItem
	},

	props: {
		aspectId: [Boolean, String],
	},

	computed: {

		...get([
			'project',
			'userCanEdit',
		]),

		dataPath() {
			return `project@data.${this.aspectId}`;
		},

		aspectData: get(':dataPath'),

		communityReporting() {
			if ( ! this.aspectData) {
				return [];
			}
			return this.aspectData.data.items;
		}

	},

	methods: {
		doEdit() {
			commit('EDIT_ASPECT', this.aspectId);
		},
	}

}

</script>
