<template>

	<main ref="container" class="app-content light social-media" v-if="template">
		<div class="container grid-xl">
			<div class="columns">
				<div class="column col-3">
					<h3 class="social-heading item-twitter-bg"><twitter-icon />Twitter</h3>
					<ul class="menu">
						<social-link
							v-for="(item, index) in twitter"
							:key="index"
							:item="item"
						/>
					</ul>
				</div>
				<div class="column col-3">
					<h3 class="social-heading item-facebook-bg"><facebook-icon />Facebook</h3>
					<ul class="menu">
						<social-link
							v-for="(item, index) in facebook"
							:key="index"
							:item="item"
						/>
					</ul>
				</div>
				<div class="column col-3">
					<h3 class="social-heading item-instagram-bg"><instagram-icon />Instagram</h3>
					<ul class="menu">
						<social-link
							v-for="(item, index) in instagram"
							:key="index"
							:item="item"
						/>
					</ul>
				</div>
				<div class="column col-3">
					<h3 class="social-heading item-youtube-bg"><youtube-icon />YouTube</h3>
					<ul class="menu">
						<social-link
							v-for="(item, index) in youtube"
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


import { get, set, sync, call } from 'vuex-pathify';

import colours from 'colors.css';
import TwitterIcon from 'vue-feather-icons/icons/TwitterIcon';
import FacebookIcon from 'vue-feather-icons/icons/FacebookIcon';
import InstagramIcon from 'vue-feather-icons/icons/InstagramIcon';
import YoutubeIcon from 'vue-feather-icons/icons/YoutubeIcon';

import Templates from '@/templates';

import SocialLink from '@/components/project/view/SocialLink';

export default {

	components: {
		TwitterIcon,
		FacebookIcon,
		InstagramIcon,
		YoutubeIcon,
		SocialLink,
	},

	computed: {

		...get([
			'project',
		]),

		template() {
			if ( ! this.project.id) {
				return false;
			}
			var template = Templates.get(this.project.template);
			return template;
		},

		socialLinks() {
			if ( ! this.template) {
				return [];
			}

			return this.project.data.social;
		},

		twitter() {
			return this.socialLinks.filter(item => item.network == 'twitter');
		},

		facebook() {
			return this.socialLinks.filter(item => item.network == 'facebook');
		},

		instagram() {
			return this.socialLinks.filter(item => item.network == 'instagram');
		},

		youtube() {
			return this.socialLinks.filter(item => item.network == 'youtube');
		},

	}

}

</script>
