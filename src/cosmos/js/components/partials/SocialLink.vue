<template>

	<li class="menu-item">
		<a :href="url" target="_blank" v-html="formattedLabel"></a>
	</li>

</template>

<script>

import { mapActions } from 'vuex';

export default {

	props: [
		'item',
	],

	computed: {

		formattedLabel() {

			let val = this.item.value;

			if (this.item.network === 'facebook') {
				let domain = 'facebook.com';
				let fbPos = val.indexOf('facebook.com');
				if (fbPos > -1) {
					val = val.substring(fbPos + domain.length);
					return val;
				}
			}

			if (this.item.network == 'twitter' || this.item.network == 'instagram') {
				val = val.replace(/^#/, '');
				return `<span class='hashtag'>#</span>${val}`;
			}
		},

		showHashtag() {
			return (this.item.network == 'twitter' || this.item.network == 'instagram');
		},

		rawHashtag() {
			return this.item.value.replace(/^#/, '').trim();
		},

		url() {
			switch (this.item.network) {
				case 'twitter':
					return `https://twitter.com/hashtag/${this.rawHashtag}`;
				break;
				case 'facebook':
					return this.item.value;
				break;
				case 'instagram':
					return `https://www.instagram.com/explore/tags/${this.rawHashtag}/`;
				break;
			}
		}
	}

}
</script>
