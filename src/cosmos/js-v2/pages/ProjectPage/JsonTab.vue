<template>

	<main ref="container" class="app-content light community-reporting">
		<div class="scrollable scr-y">
			<div class="container grid-xl">
				<pre>{{ project }}</pre>
			</div>
		</div>
	</main>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

import Network from "@/services/Network";

export default {

	computed: {
		...get([
			'project',
		]),
	}

}

</script>

<style scoped>
pre {
	background: #fff;
	font-size: 80%;
}
</style>
