
<template>
	<span class="chip chip-template">{{ templateTitle }}</span>
</template>

<script>

import Templates from '@/templates';

export default {

	props: ['project'],

	computed: {

		templateTitle() {
			var tpl = Templates.get(this.project.template);
			return tpl ? tpl.CONFIG.title : this.template;
		}

	}

}
</script>
