<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Social Media" />

		<div class="sidebar-top" v-show="visible">
			<ul class="tab tab-block">
				<li class="tab-item item-twitter-bg" :class="activeTab == 'twitter' ? 'active' : ''">
					<a href="javascript:;" @click="activateTab('twitter')">Twitter</a>
				</li>
				<li class="tab-item item-facebook-bg" :class="activeTab == 'facebook' ? 'active' : ''">
					<a href="javascript:;" @click="activateTab('facebook')">Facebook</a>
				</li>
				<li class="tab-item item-instagram-bg" :class="activeTab == 'instagram' ? 'active' : ''">
					<a href="javascript:;" @click="activateTab('instagram')">Instagram</a>
				</li>
			</ul>
		</div>

		<div class="sidebar-content" v-show="activeTab == 'twitter' && visible">
			<p>Enter a Twitter hashtag, with or without the #. Press enter to add.</p>
			<div class="form-group">
				<input
					@keyup.enter="addItem({ event: $event, network: 'twitter' })"
					class="form-input"
					autofocus
					autocomplete="off"
				>
			</div>
			<ul>
				<social-item
					v-for="(item, index) in twitter"
					:key="index"
					:item="item"
					:network="twitter"
				/>
			</ul>

		</div>

		<div class="sidebar-content" v-show="activeTab == 'facebook' && visible">
			<p>Add full links (URLs) to Facebook groups or pages.</p>
		</div>

		<div class="sidebar-content" v-show="activeTab == 'instagram' && visible">
			<p>Add Instagram hashtags, with or without the #.</p>
			<!-- https://www.instagram.com/explore/tags/websearch/ -->
		</div>

	</div>

</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';

import SocialItem from './SocialItem.vue';

export default {

	components: {
		SocialItem,
	},

	data() {
		return {
			panelName: 'social',
			activeTab: 'twitter',
		};
	},

	computed: {
		...mapState('app', {
			visible(state) {
				return state.editPanel == this.panelName
			},
		}),
		...mapState('project', {
			projectData: state => state.project.data,
		}),
		...mapGetters('project', ['social']),
		twitter() {
			return this.social.filter(item => item.network == 'twitter');
		},
	},

	methods: {

		activateTab(name) {
			this.activeTab = name;
		},

		addItem({ event, network }) {
			let value = event.target.value;
			if (value.trim()) {
				this.$store.commit('project/addSocial', { network: network, value: value });
			}
			event.target.value = '';
		}
	}

}
</script>
