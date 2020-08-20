<template>

	<main ref="container" class="app-content light theory-of-change" v-if="theoryOfChange">
		<div class="container grid-xl">
			<h4 class="mb-8 mt-4">Theory of Change</h4>

			<div class="columns external-items ">
				<external-item
					v-for="(item, index) in theoryOfChange"
					:key="index"
					:item="item"
					type="toc"
				/>
			</div>
		</div>
	</main>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

import ExternalItem from '@/components/project/view/ExternalItem';

export default {

	name: "TheoryOfChangeView",

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

		theoryOfChange() {
			if ( ! this.aspectData) {
				return [];
			}
			return this.aspectData.data.items;
		}

	}

}

</script>
