<template>

	<main ref="container" class="app-content light theory-of-change">
		<div class="container grid-xl">
			<h4 class="mb-8 mt-4">Theory of Change</h4>

			<div class="columns external-items ">
				<external-item
					v-for="(item, index) in theoryOfChange"
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
			type: 'toc',
		}
	},

	computed: {

		...mapGetters('project', [
			'theoryOfChange',
		]),

	},

}
</script>
