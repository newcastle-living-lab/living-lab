<template>

	<main ref="container" class="app-content light living-lab-models scrollable scr-y" v-if="template">
		<div class="container grid-x">
			<h4 class="mb-8 mt-4">Living Lab Models</h4>

			<div class="columns external-items ">
				<external-item
					v-for="(item, index) in livingLabModels"
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

		livingLabModels() {
			if ( ! this.template) {
				return [];
			}

			return this.project.data.livingLabModels.items;
		}

	}

}

</script>
