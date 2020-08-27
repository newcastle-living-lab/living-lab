<template>

	<aside class="app-sidebar">
		<AspectsView
			v-show="!isEditing"
			:aspectId="aspectId"
		/>
		<EditorView
			v-if="isEditing"
			:aspectId="aspectId"
		/>
	</aside>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

import AspectsView from './AspectsView';
import EditorView from './EditorView';

import Aspects from '@/aspects';

export default {

	components: {
		AspectsView,
		EditorView,
	},

	props: {
		aspectId: String,
	},

	data() {
		return {
			// aspectEditId: false,
		}
	},

	computed: {

		...get([
			'aspectEditId',
		]),

		isEditing() {
			return (this.aspectEditId !== false);
		}

	},

	methods: {

		/*doEdit(aspectId) {
			this.aspectEditId = aspectId;
			// console.log(`Current aspect: ${this.aspectId}`);
			// console.log(`Do edit on: ${aspectId}`);
			if (this.aspectEditId && this.aspectEditId != this.aspectId) {
				// Get aspect details to get the route to push.
				// This is done so that Editing any non-current aspect switches the current aspect to the one being edited.
				const aspect = Aspects.get(aspectId);
				const params = {...this.$route.params, aspectId: aspectId }
				this.$router.push({ name: aspect.CONFIG.routeName, params: params });
			}
		}*/

	}

}
</script>
