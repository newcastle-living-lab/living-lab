<template>

	<div class="sidebar-content">

		<VGroup :name="inputId('title')" label="Title">
			<VInput type="text" v-model="val.title" maxlength="255" />
		</VGroup>

		<VGroup :name="inputId('body')" :label="definitionBody.label">
			<span class="form-input-hint" v-if="definitionBody.hint">{{ definitionBody.hint }}</span>
			<VTextarea rows="10" v-model="val.body" />
		</VGroup>

	</div>

</template>

<script>

export default {

	name: "InfoEditor",

	props: {
		definition: Object,
		value: Object,
	},

	computed: {

		val: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			}
		},

		definitionBody() {

			var body = {
				label: 'Description',
				hint: false
			};

			if (this.definition.body) {
				if (this.definition.body.label) {
					body.label = this.definition.body.label;
				}
				if (this.definition.body.hint) {
					body.hint = this.definition.body.hint;
				}
			}

			return body;
		},

	},

	methods: {
		inputId(forInput) {
			return `${this.definition.id}_${forInput}`;
		}
	},

	mounted() {
		this.val = this.value;
	},

}
</script>
