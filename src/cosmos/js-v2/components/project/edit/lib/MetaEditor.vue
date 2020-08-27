<template>

	<div class="sidebar-content">

		<VGroup name="name" label="Name">
			<VInput type="text" id="name" v-model="value.name" maxlength="255" />
		</VGroup>

		<VGroup name="created_by" label="Created by">
			<VInput type="text" id="created_by" v-model="value.created_by" maxlength="255" />
		</VGroup>
	</div>

</template>

<script>

export default {

	name: "MetaEditor",
	props: ['value'],

}
</script>
