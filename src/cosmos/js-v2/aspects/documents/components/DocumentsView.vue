<template>

	<main ref="container" class="app-content light living-lab-models scrollable scr-y" v-if="documents">
		<div class="container grid-x">
			<h4 class="mb-8 mt-4">Documents and Files</h4>

			<div class="columns external-items ">
				<ExternalItem
					v-for="(item, index) in documents"
					:key="index"
					:item="item"
					type="livlabmod"
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

	name: "DocumentsView",

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

		documents() {
			if ( ! this.aspectData) {
				return [];
			}
			return this.aspectData.data.items;//project.data.livingLabModels.items;
		}

	}

}

</script>
