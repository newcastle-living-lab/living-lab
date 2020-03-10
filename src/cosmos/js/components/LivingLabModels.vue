<template>

	<main ref="container" class="app-content light community-reporting scrollable scr-y">
		<div class="container grid-x">
			<h4 class="mb-8 mt-4">Living Lab Models</h4>

			<div class="columns external-items ">
				<external-item
					v-for="(item, index) in livingLabModels"
					:key="index"
					:item="item"
				/>
			</div>
		</div>
	</main>

</template>

<script>

import { mapGetters } from 'vuex';
import colours from 'colors.css';

import ExternalItem from './partials/ExternalItem.vue';

export default {

	components: {
		ExternalItem,
	},

	data() {
		return {
			type: 'livlabmod',
		}
	},

	computed: {

		...mapGetters('project', [
			'livingLabModels',
		]),

	},

}
</script>
