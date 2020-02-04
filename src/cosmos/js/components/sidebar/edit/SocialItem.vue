<template>

	<li class="menu-item">

		<div v-show="!editing" @dblclick="editing = true" v-html="formattedValue"></div>
		<div v-show="editing">
			<div class="form-group">
				<input
					v-focus="editing"
					:value="item.value"
					@keyup.enter="doneEdit"
					@keyup.esc="cancelEdit"
					@blur="doneEdit"
					class="form-input"
				>
			</div>
		</div>
	</li>


</template>

<script>

import { mapActions } from 'vuex';

export default {

	directives: {
		focus (el, { value }, { context }) {
			if (value) {
				context.$nextTick(() => {
					el.focus()
				})
			}
		}
	},

	props: [
		'item',
		'network',
	],

	data() {
		return {
			editing: false,
		}
	},

	computed: {
		formattedValue() {
			let val = this.item.value;

			if (this.network === 'facebook') {
				let domain = 'facebook.com';
				let fbPos = val.indexOf('facebook.com');
				if (fbPos > -1) {
					val = val.substring(fbPos + domain.length);
					return val;
				}
			}

			if (this.network == 'twitter' || this.network == 'instagram') {
				val = val.replace(/^#/, '');
				return `<span class='hashtag'>#</span>${val}`;
			}

			if (this.network == 'youtube') {
				let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
				let match = val.match(regExp);
				if (match && match[2].length == 11) {
					return match[2];
				}
			}
		},
		showHashtag() {
			return (this.network == 'twitter' || this.network == 'instagram');
		}
	},

	methods: {
		...mapActions('project', [
			'editSocial',
			'removeSocial'
		]),
		doneEdit(e) {
			const value = e.target.value.trim().replace(/^#/, '');
			const { item } = this;
			if ( ! value) {
				this.removeSocial(item);
				this.$emit('deleted');
			} else if (this.editing) {
				this.editSocial({
					item,
					value
				});
				this.editing = false
			}
		},
		cancelEdit(e) {
			e.target.value = this.item.value;
			this.editing = false
		}
	}

}
</script>
