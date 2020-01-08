<template>

	<section class="app-toolbar">

		<div class="container">
			<div class="columns">
				<div class="column col-6">

					<button class='btn btn-link'
						@click="onNew"
					>New</button>

					<button class='btn btn-link'
						@click="onOpen"
					>Open...</button>

					<button class='btn btn-link'
						@click="onEdit"
					>Edit</button>

				</div>
				<div class="column col-6 text-right">
					<div v-if="project">
						<router-link :to="projectionUrl" class="btn btn-link" :class="activeTab == 'projection' ? 'active' : ''">Projection</router-link>
						<router-link :to="socialUrl" class="btn btn-link">Social Media</router-link>
					</div>
				</div>
					<!-- <ul class="tab">
						<li class="tab-item active">
							<router-link to="/123/projection" class="btn btn-link">Projection</router-link>
						</li>
						<li class="tab-item">
							<router-link to="/123/social" class="btn btn-link">Social Media</router-link>
						</li>
					</ul>
									</div> -->
			</div>
		</div>

	</section>

</template>

<script>

import {appStore} from '../store/app';
import {nodeStore} from '../store/nodes';

export default {

	props: {
		project: Object
	},

	computed: {
		projectionUrl: function() {
			return `/${this.project.id}/projection`;
		},
		socialUrl: function() {
			return `/${this.project.id}/social`;
		},
		activeTab: function() {
			return this.$route.name;
		}
	},

	data() {
		return {
			app: appStore.state,
			nodes: nodeStore.state
		}
	},

	methods: {
		onNew() {
			this.$emit('onNew');
		},
		onOpen() {
			this.$emit('onOpen');
		},
		onSave() {
			this.$emit('onSave');
		},
		onEdit() {
			this.$emit('onEdit');
		}
	}

}
</script>
