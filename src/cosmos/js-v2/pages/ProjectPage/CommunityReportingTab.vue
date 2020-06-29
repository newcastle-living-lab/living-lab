<template>

	<main ref="container" class="app-content light community-reporting" v-if="template">
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

import Templates from '@/templates';

import ExternalItem from '@/components/project/view/ExternalItem';

export default {

	components: {
		ExternalItem
	},

	computed: {

		...get([
			'project',
		]),

		template() {
			if ( ! this.project.id) {
				return false;
			}
			var template = Templates.get(this.project.template);
			return template;
		},

		communityReporting() {
			if ( ! this.template) {
				return [];
			}

			return this.project.data.communityReporting;
		}

	}

}

</script>
