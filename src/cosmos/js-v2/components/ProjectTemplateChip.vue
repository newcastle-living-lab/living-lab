
<template>
	<span class="chip chip-template">{{ templateTitle }}</span>
</template>

<script>

import find from 'lodash/find';

import templates from '@/data/templates.json';

export default {

	props: ['project'],

	computed: {

		templateTitle() {
			var tpl = find(templates, { name: this.project.template });
			return tpl ? tpl.title : this.project.template;
		}

	}

}
</script>

<style>
</style>
