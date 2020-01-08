<template>

	<div ref="container">
		<v-stage ref="stage" :config="stageSize">
			<v-layer>
				<v-text :config="nodes.title"/>
				<v-text :config="nodes.subtitle"/>
				<v-rect :config="nodes.goalsBorder"/>
				<v-rect :config="nodes.goalsTitle"/>
				<v-rect :config="nodes.goalsText"/>
				<!-- <v-circle :config="configCircle"></v-circle> -->
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
				width: 0,
				height: 0
			},

			nodes: nodeStore.state,

			configCircle: {
				x: 100,
				y: 100,
				radius: 70,
				fill: "red",
				stroke: "black",
				strokeWidth: 4
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
