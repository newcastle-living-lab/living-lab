<template>

	<div>
		<div class="sidebar-top">
			<ul class="tab tab-block tab-social">
				<li
					v-for="tab in tabs"
					:key="tab.id"
					:class="['tab-item', tab.class, tab.id == activeTab ? 'active' : '']"
				>
					<a href="javascript:;" @click.prevent="activeTab = tab.id">
						<component v-bind:is="tab.icon" />
					</a>
				</li>
			</ul>
		</div>


		<div class="sidebar-content">

			<p class="form-input-hint">Double-click an item to edit it, and enter to save.</p>

			<div
				v-for="tab in tabs"
				:key="tab.id"
				v-show="tab.id == activeTab"
			>
				<p class="form-input-hint">{{ tab.hint }}</p>

				<VGroup :name="inputId(tab.id + '_new')" class="mb-8">
					<VInput
						ref="new_item_label"
						:id="inputId(tab.id + 'new')"
						@enter="addNewItem({ event: $event, network: tab.id })"
						type="text"
						maxlength="255"
						autocomplete="off"
					/>
				</VGroup>

				<ul class="menu social-edit-menu">
					<SocialEditorItem
						v-for="(value, index) in val[tab.id]"
						:key="index"
						:index="index"
						:value="value"
						:network="tab.id"
						@update-item="updateItem(tab.id, index, $event)"
						@delete-item="deleteItem(tab.id, index)"
					/>
				</ul>
			</div>
		</div>

	</div>


</template>

<script>

import TwitterIcon from 'vue-feather-icons/icons/TwitterIcon';
import FacebookIcon from 'vue-feather-icons/icons/FacebookIcon';
import InstagramIcon from 'vue-feather-icons/icons/InstagramIcon';
import YoutubeIcon from 'vue-feather-icons/icons/YoutubeIcon';

import SocialEditorItem from './SocialEditorItem.vue';

const tabs = [
	{
		"id": "twitter",
		"icon": "twitter-icon",
		"class": "item-twitter-bg",
		"hint": "Enter a Twitter hashtag, with or without the #. Press enter to add.",
	},
	{
		"id": "facebook",
		"icon": "facebook-icon",
		"class":
		"item-facebook-bg",
		"hint": "Add full links (URLs) to Facebook groups or pages."
	},
	{
		"id": "instagram",
		"icon": "instagram-icon",
		"class":
		"item-instagram-bg",
		"hint": "Enter an Instagram hashtag, with or without the #. Press enter to add."
	},
	{
		"id": "youtube",
		"icon": "youtube-icon",
		"class":
		"item-youtube-bg",
		"hint": "Enter a link to a YouTube video and press enter to add."
	},
];

export default {

	name: "SocialEditor",

	components: {
		TwitterIcon,
		FacebookIcon,
		InstagramIcon,
		YoutubeIcon,
		SocialEditorItem,
	},

	props: {
		definition: Object,
		value: Object,
	},

	data() {
		return {
			activeTab: 'twitter',
			tabs: tabs,
		}
	},

	computed: {

		val: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			}
		},

	},

	methods: {

		inputId(forInput) {
			return `${this.definition.id}_${forInput}`;
		},

		addNewItem({ event, network }) {
			let value = event.target.value;
			if (value.trim()) {
				this.val[network].push(value.trim());
			}
			event.target.value = '';
		},

		updateItem(network, index, value) {
			this.val[network].splice(index, 1, value);
		},

		deleteItem(network, index) {
			console.log("Delete!");
			this.val[network].splice(index, 1);
			return;
			var items = [...this.val[network]];
			items.splice(index, 1);
			console.log(items);
			/*this.val[network].splice(index, 1);
			if (this.val[network].indexOf(index) > -1) {
				// this.val[network].push('deleteditem');// = [...items];
			}*/
		}

/*

		setEditItem(item) {
			this.editingItem = item;
		},

		deleteItem(item) {
			let items = this.val.items;
			if (items.indexOf(item) > -1) {
				items.splice(items.indexOf(item), 1);
				this.val.items = items;
			}
		},*/

	},

	mounted() {
		this.val = this.value;
	},

}
</script>
