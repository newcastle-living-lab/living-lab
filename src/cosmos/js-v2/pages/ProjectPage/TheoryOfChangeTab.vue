<template>
	<h1>THEORY OF CHANGE</h1>
</template>

<script>

import {appStore} from '@/store/app';
import Network from "@/services/Network";

export default {

	components: {

	},

	data() {
		return {
			app: appStore.state,
			project: {},
		}
	},

}

</script>
