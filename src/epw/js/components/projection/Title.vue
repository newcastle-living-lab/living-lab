<template>

	<v-group>
		<v-text ref="title" :config="config"/>
	</v-group>

</template>

<script>

import { mapState } from 'vuex';

export default {

	computed: {

		...mapState('project', {
			projectData: state => state.project.data
		}),

		config() {
			return {
				text: this.projectData.title,
				fontSize: 20,
				fontStyle: 'bold',
				lineHeight: 1.3,
				x: 20,
				y: 20,
				width: 400,
			}
		}

	},

	watch: {
		// 'projectData.title': 'sendDims',
	},

	methods: {

		sendDims() {

			return;

			this.$nextTick(() => {

				var node = this.$refs.projectTitle.getNode();

				let dims = {
					x: node.absolutePosition().x,
					y: node.absolutePosition().y,
					height: node.getClientRect().height,
					width: node.getClientRect().width,
				};

				this.$emit('update-dims', {
					source: 'title',
					data: dims,
				});

			});

		}

	}

}
</script>
