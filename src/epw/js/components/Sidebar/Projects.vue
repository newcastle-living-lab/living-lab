<template>

	<div>

		<h3 class="sidebar-heading">Projects</h3>

		<ul class="menu simple-menu">
			<li class="menu-item"
				v-for="project in projects"
				:key="project.id"
			>
				<router-link :to="'/' + project.id + '/projection'">{{ project.name }}</router-link>
			</li>
		</ul>

	</div>

</template>

<script>

import {appStore} from '../../store/app';
import {nodeStore} from '../../store/nodes';

export default {

	props: {
		projects: Array,
	},

	data() {
		return {
			app: appStore.state,
			nodes: nodeStore.state
		}
	},

	methods: {
		onSave() {
			this.$emit('onSave');
		}
	}

}
</script>
