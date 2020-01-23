<template>

	<div class="toast app-toast" :class="className" v-show="toast.active">
		<button class="btn btn-clear float-right" @click="clearToast"></button>
		{{ toast.content }}
	</div>

</template>

<script>

import { mapState, mapActions } from 'vuex';

let timer = null;

export default {

	watch: {
		'toast.active': 'disappear'
	},

	computed: {
		...mapState('app', {
			toast: 'toast',
			className(state) {
				return `toast-${state.toast.type}`;
			}
		}),
	},

	methods: {
		clearToast() {
			this.$store.dispatch('app/doToast', false);
		},
		disappear() {
			if ( ! this.toast.seconds) {
				return;
			}
			if (this.toast.active) {
				timer = window.setTimeout(() => {
					this.$store.dispatch('app/doToast', false);
				}, this.toast.seconds * 1000);
			} else {
				window.clearTimeout(timer);
			}
		}
	},

	activated() {
		console.log("Activated");
	}

}
</script>
