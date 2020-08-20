<template>

	<main ref="container" class="app-content light community-reporting" v-if="communityReporting">
		<div class="container grid-xl">
			<h4 class="mb-8 mt-4">Community Reporting</h4>

			<div class="columns external-items ">
				<external-item
					v-for="(item, index) in communityReporting"
					:key="index"
					:item="item"
					type="comrep"
				/>
			</div>
		</div>
	</main>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

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

	}

}

</script>
