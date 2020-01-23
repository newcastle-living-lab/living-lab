<template>

	<main ref="container" class="app-content light social-media">
		<div class="container grid-xl">
			<div class="columns">
				<div class="column col-4">
					<h3 class="social-heading item-twitter-bg"><twitter-icon />Twitter</h3>
					<ul class="menu">
						<social-link
							v-for="(item, index) in twitter"
							:key="index"
							:item="item"
						/>
					</ul>
				</div>
				<div class="column col-4">
					<h3 class="social-heading item-facebook-bg"><facebook-icon />Facebook</h3>
					<ul class="menu">
						<social-link
							v-for="(item, index) in facebook"
							:key="index"
							:item="item"
						/>
					</ul>
				</div>
				<div class="column col-4">
					<h3 class="social-heading item-instagram-bg"><instagram-icon />Instagram</h3>
					<ul class="menu">
						<social-link
							v-for="(item, index) in instagram"
							:key="index"
							:item="item"
						/>
					</ul>
				</div>
			</div>
		</div>
	</main>

</template>

<script>

import { mapGetters } from 'vuex';
import colours from 'colors.css';
import TwitterIcon from 'vue-feather-icons/icons/TwitterIcon';
import FacebookIcon from 'vue-feather-icons/icons/FacebookIcon';
import InstagramIcon from 'vue-feather-icons/icons/InstagramIcon';

import SocialLink from './partials/SocialLink.vue';

export default {

	components: {
		TwitterIcon,
		FacebookIcon,
		InstagramIcon,
		SocialLink,
	},

	computed: {

		...mapGetters('project', [
			'social',
		]),

		twitter() {
			return this.social.filter(item => item.network == 'twitter');
		},
		facebook() {
			return this.social.filter(item => item.network == 'facebook');
		},
		instagram() {
			return this.social.filter(item => item.network == 'instagram');
		},

	},

}
</script>
