<template>

	<main ref="container" class="app-content light community-reporting">
		<div class="container grid-xl">
			<h4 class="mb-8 mt-4">Community Reporting</h4>

			<div class="columns external-items ">
				<external-item
					v-for="(item, index) in filteredItems"
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
			type: 'comrep',
		}
	},

	computed: {

		...mapGetters('project', [
			'externals',
		]),

		filteredItems() {
			return this.externals.filter(item => item.type == this.type);
		},

	},

}
</script>
