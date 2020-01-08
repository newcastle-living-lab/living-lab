<template>

	<div ref="container">
		<v-stage ref="stage" :config="stageSize">
			<v-layer>
				<v-text :config="nodes.title"/>
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

import {appStore} from '../store/app';
import {nodeStore} from '../store/nodes';

export default {

	data() {
		return {

			stageSize: {
				width: 640,
				height: 480
			},

			nodes: nodeStore.state,

			configCircle: {
				x: 300,
				y: 300,
				radius: 70,
				fill: "#ff6400",
				stroke: "#444444",
				strokeWidth: 2
			},

			app: appStore.state,
		}
	},

	mounted() {
		var w = this.$refs.container.clientWidth,
			h = w / 1.4;
		this.stageSize.width = w;
		this.stageSize.height = Math.ceil(h);
	}

}
</script>
