<template>
	<a class="tile stakeholder-tile" :href="stakeholder.url" target="_blank">
		<div class="tile-icon">
			<div class="tile-icon-wrapper" :style="iconStyle">
				<component v-bind:is="iconName" v-bind="iconProps" />
			</div>
		</div>
		<div class="tile-content">
    		<div class="tile-label">{{ stakeholder.label }}</div>
    		<small class="tile-type text-gray">{{ stakeholderType }}</small>
    	</div>
	</a>
</template>

<script>

import UserIcon from 'vue-feather-icons/icons/UserIcon';
import UsersIcon from 'vue-feather-icons/icons/UsersIcon';
import GridIcon from 'vue-feather-icons/icons/GridIcon';


export default {

	name: "StakeholderTile",

	components: {
		UserIcon,
		UsersIcon,
		GridIcon,
	},

	props: {
		stakeholder: Object
	},

	data() {
		return {
			iconProps: {
				width: '24',
				height: '24',
			}
		}
	},

	computed: {

		iconStyle() {
			return {
				borderColor: this.stakeholder.colour,
				color: this.stakeholder.colour
			}
		},

		iconName() {
			var icons = {
				user: 'UserIcon',
				organisation: 'UsersIcon',
				service: 'GridIcon'
			};

			return icons[this.stakeholder.type];
		},

		stakeholderType() {
			var types = {
				user: 'User',
				organisation: 'Organisation',
				service: 'Service',
			};

			return types[this.stakeholder.type];
		}

	}


}

</script>
