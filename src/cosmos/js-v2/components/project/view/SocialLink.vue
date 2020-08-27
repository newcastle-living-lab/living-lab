<template>

	<li class="menu-item">
		<a :href="url" target="_blank" v-html="formattedLabel"></a>
	</li>

</template>

<script>

import { mapActions } from 'vuex';

export default {

	props: {
		value: String,
		network: String,
	},

	computed: {

		formattedLabel() {

			let val = this.value;

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
		},

		rawHashtag() {
			return this.value.replace(/^#/, '').trim();
		},

		url() {
			switch (this.network) {
				case 'twitter':
					return `https://twitter.com/hashtag/${this.rawHashtag}`;
				break;
				case 'facebook':
				case 'youtube':
					return this.value;
				break;
				case 'instagram':
					return `https://www.instagram.com/explore/tags/${this.rawHashtag}/`;
				break;
			}
		}
	}

}
</script>
