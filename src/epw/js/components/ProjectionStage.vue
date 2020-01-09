<template>

	<div ref="container">
		<v-stage ref="stage" :config="stageSize">
			<v-layer>
				<v-text :config="projectTitleConfig"/>
				<v-text :config="nodes.subtitle"/>
				<v-rect :config="nodes.goalsBorder"/>
				<!-- <v-rect :config="nodes.goalsTitle"/>
				<v-rect :config="nodes.goalsText"/> -->
				<v-circle :config="configCircle"></v-circle>
			</v-layer>
		</v-stage>
	</div>

</template>

<script>

import { mapState, mapActions } from 'vuex';

export default {

	data() {
		return {

			stageSize: {
				width: 640,
				height: 480
			},

			nodes: {
				title: {
					text: '',
					fontSize: 16,
					fontStyle: 'bold',
					x: 20,
					y: 20
				},

				subtitle: {
					text: 'Goals',
					fontSize: 16,
					// fontStyle: 'bold',
					x: 20,
					y: 50
				},

				goalsBorder: {
					x: 20,
					y: 50,
					width: 100,
					height: 100,
					// fill: 'red',
					shadowBlur: 10
				}
			},

			configCircle: {
				x: 300,
				y: 300,
				radius: 70,
				fill: "#ff6400",
				stroke: "#444444",
				strokeWidth: 2
			}

		}
	},

	computed: {
		...mapState('projects', {
			projectTitleConfig(state) {
				return {
					text: state.currentProject ? state.currentProject.name : '',
					fontSize: 16,
					fontStyle: 'bold',
					x: 20,
					y: 20
				}
			}
		})
	},

	mounted() {
		var w = this.$refs.container.clientWidth,
			h = w / 1.4;
		this.stageSize.width = w;
		this.stageSize.height = Math.ceil(h);
	},

	created() {
		console.log("Created");
	}

}
</script>
