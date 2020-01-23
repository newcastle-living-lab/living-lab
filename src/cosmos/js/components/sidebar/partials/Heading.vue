<template>

	<h3 @click="activate()" class="sidebar-heading" :class="clickable ? 'clickable' : ''">{{ title }}</h3>

</template>

<script>

import { mapState, mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';

export default {

	props: {
		name: String,
		title: String,
		clickable: {
			type: Boolean,
			default: true
		}
	},

	methods: {
		activate() {
			this.$store.dispatch('app/setEdit', this.name);
		}
	}

}

</script>
