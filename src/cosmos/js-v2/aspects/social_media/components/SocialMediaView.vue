<template>

	<main ref="container" class="app-content light social-media" v-if="socialLinks">
		<div class="container grid-xl">
			<h4 class="mb-8 mt-4">Social Media</h4>
		</div>
		<div class="container grid-xl">
			<div class="columns">
				<div class="column col-3">
					<h3 class="social-heading item-twitter-bg"><twitter-icon />Twitter</h3>
					<ul class="menu">
						<social-link
							v-for="(value, index) in socialLinks.twitter"
							:key="index"
							:value="value"
							network="twitter"
						/>
					</ul>
				</div>
				<div class="column col-3">
					<h3 class="social-heading item-facebook-bg"><facebook-icon />Facebook</h3>
					<ul class="menu">
						<social-link
							v-for="(value, index) in socialLinks.facebook"
							:key="index"
							:value="value"
							network="facebook"
						/>
					</ul>
				</div>
				<div class="column col-3">
					<h3 class="social-heading item-instagram-bg"><instagram-icon />Instagram</h3>
					<ul class="menu">
						<social-link
							v-for="(value, index) in socialLinks.instagram"
							:key="index"
							:value="value"
							network="instagram"
						/>
					</ul>
				</div>
				<div class="column col-3">
					<h3 class="social-heading item-youtube-bg"><youtube-icon />YouTube</h3>
					<ul class="menu">
						<social-link
							v-for="(value, index) in socialLinks.youtube"
							:key="index"
							:value="value"
							network="youtube"
						/>
					</ul>
				</div>
			</div>
		</div>
	</main>

</template>

<script>


import { get, set, sync, call } from 'vuex-pathify';

import colours from 'colors.css';
import TwitterIcon from 'vue-feather-icons/icons/TwitterIcon';
import FacebookIcon from 'vue-feather-icons/icons/FacebookIcon';
import InstagramIcon from 'vue-feather-icons/icons/InstagramIcon';
import YoutubeIcon from 'vue-feather-icons/icons/YoutubeIcon';

import SocialLink from '@/components/project/view/SocialLink';

export default {

	name: "SocialMediaView",

	components: {
		TwitterIcon,
		FacebookIcon,
		InstagramIcon,
		YoutubeIcon,
		SocialLink,
	},

	props: {
		aspectId: [Boolean, String],
	},

	computed: {

		...get([
			'project',
		]),

		dataPath() {
			return `project@data.${this.aspectId}`;
		},

		aspectData: get(':dataPath'),

		socialLinks() {
			if ( ! this.aspectData) {
				return [];
			}
			return this.aspectData.data;
		}

	}

}

</script>
