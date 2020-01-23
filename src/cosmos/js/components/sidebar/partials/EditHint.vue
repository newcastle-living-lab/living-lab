<template>

	<div class="sidebar-hint">
		<info-icon size="16" />
		<slot name="main"></slot>
	</div>

</template>

<script>

import InfoIcon from 'vue-feather-icons/icons/InfoIcon';

export default {

	components: {
		InfoIcon,
	},


}

</script>
