<template>

	<transition name="fade">
		<div class="toast app-toast" :class="className" v-if="toast.active">
			<button class="btn btn-clear float-right" @click="clearToast"></button>
			{{ toast.message }}
		</div>
	</transition>

</template>

<script>

import { get, sync, commit } from 'vuex-pathify';

let timer = null;

export default {

	watch: {
		'toast.active': 'disappear'
	},

	computed: {

		toast: get('toast'),

		className() {
			return `toast-${this.toast.type}`;
		}
	},

	methods: {
		clearToast() {
			commit('CLEAR_TOAST');
			// this.$store.dispatch('app/doToast', false);
		},
		disappear() {
			if ( ! this.toast.seconds) {
				return;
			}
			if (this.toast.active) {
				timer = window.setTimeout(() => {
					commit('CLEAR_TOAST');
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

<style scoped>
.fade-enter-active, .fade-leave-active {
	transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
	opacity: 0;
}
</style>
