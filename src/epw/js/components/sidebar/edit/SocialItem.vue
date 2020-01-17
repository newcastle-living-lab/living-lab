<template>

	<li class="item">
		<div class="view">
			<label v-text="item.value" @dblclick="editing = true"></label>
			<button class="destroy" @click="removeItem(item)"></button>
		</div>
		<input class="edit"
			v-show="editing"
			v-focus="editing"
			:value="item.value"
			@keyup.enter="doneEdit"
			@keyup.esc="cancelEdit"
			@blur="doneEdit"
		>
	</li>

</template>

<script>

import { mapState, mapActions } from 'vuex';

export default {

	props: [
		'item',
		'network',
	],

	data() {
		return {
			editing: false,
		}
	}

}
</script>
