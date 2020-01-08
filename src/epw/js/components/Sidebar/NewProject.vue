<template>

	<div>

		<h3>New project</h3>
		<div class="form-group">
			<label class="form-label" for="titleText">Name</label>
			<textarea class="form-input" id="titleText" placeholder="" rows="2" v-model="nodes.title.text"></textarea>
		</div>

		<div class="form-group">
			<label class="form-label" for="subtitleText">Subtitle</label>
			<textarea class="form-input" id="subtitleText" placeholder="" rows="2" v-model="nodes.subtitle.text"></textarea>
		</div>

	</div>

</template>

<script>

import {appStore} from '../../store/app';
import {nodeStore} from '../../store/nodes';

export default {

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
