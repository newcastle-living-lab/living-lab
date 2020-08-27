<template>

	<li class="menu-item">

		<div v-show="!isEditing" @dblclick="startEdit" v-html="formattedValue"></div>

		<div v-show="isEditing">
			<div class="form-group--">
				<input
					v-focus="isEditing"
					v-model="val"
					@keyup.enter="doneEdit"
					@keyup.esc="cancelEdit"
					@blur="doneEdit"
					class="form-input input-sm"
				>
			</div>
		</div>
	</li>


</template>

<script>

export default {

	name: "SocialEditorItem",

	directives: {
		focus (el, { value }, { context }) {
			if (value) {
				context.$nextTick(() => {
					el.focus()
				})
			}
		}
	},

	props: {
		'value': String,
		'network': String,
		'index': Number,
	},

	data() {
		return {
			isEditing: false,
			updatingValue: false,
			val: '',
		}
	},

	computed: {

		formattedValue() {
			let val = this.value;

			if (this.network === 'facebook') {
				let domain = 'facebook.com';
				let fbPos = val.indexOf('facebook.com');
				if (fbPos > -1) {
					val = val.substring(fbPos + domain.length);
					return val;
				}
				return val;
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
				return val;
			}
		},

		showHashtag() {
			return (this.network == 'twitter' || this.network == 'instagram');
		}
	},

	methods: {

		startEdit() {
			// Reset flags to start editing
			this.isEditing = true;
			this.updatingValue = false;
			// Set local `val` from passed-in prop
			this.val = this.value;
		},

		doneEdit(e) {

			// updatingValue is a flag to prevent two event triggers from both enter and blur.

			if (this.updatingValue) {
				return;
			}

			this.updatingValue = true;

			const value = this.val.trim().replace(/^#/, '');

			if ( ! value || value.length === 0) {
				this.$emit('delete-item');
			} else {
				this.$emit('update-item', value);
			}

			this.isEditing = false;
		},

		cancelEdit(e) {
			this.val = this.value;
			this.isEditing = false;
			this.updatingValue = false;
		}

	},

	mounted() {
		this.val = this.value;
		this.updatingValue = false;
	}

}
</script>
