<template>

	<div>

		<div class="form-group">
			<label class="form-label" for="name">Name</label>
			<VInput type="text" id="name" v-model="value.name" />
		</div>

		<div class="form-group">
			<label class="form-label" for="template">Template</label>
			<VSelect v-model="value.template">
				<option v-for="(tpl, idx) in templates" :value="tpl.name">{{ tpl.title }}</option>
			</VSelect>
		</div>

		<div class="form-group">
			<label class="form-label" for="created_by">Created by</label>
			<VInput type="text" id="created_by" v-model="value.created_by" />
		</div>

	</div>

</template>

<script>

import templates from '@/data/templates.json';

export default {

	props: {
		value: {
			default() {
				return {
					name: null,
					template: null,
					created_by: null,
					created_at: null,
					modified_at: null,
				};
			}
		},
	},

	data() {
		return {
			templates: templates,
			previousValue: {
				name: null,
				template: null,
				created_by: null,
				created_at: null,
				modified_at: null,
			}
		};
	},

	mounted() {
		this.$emit('input', this.filterValue(this.value));
	},

	watch: {

		value: {
			handler: function (value) {
				if (JSON.stringify(value) === JSON.stringify(this.previousValue)) {
					return;
				}
				this.previousValue = JSON.parse(JSON.stringify(value));

				this.$emit('input', this.filterValue(value));
			},
			deep: true
		},

	},

	methods: {

		filterValue(value) {
			const name = value.name === null || value.name === "" ? undefined : value.name;
			const template = value.template === null || value.template === "" ? undefined : value.template;
			const created_by = value.created_by === null || value.created_by === "" ? undefined : value.created_by;

			const created_at = (new Date()).toLocaleDateString();
			const modified_at = (new Date()).toLocaleDateString();

			return {
				name: name,
				template: template,
				created_by: created_by,
				created_at: created_at,
				modified_at: modified_at,
			};
		}

	}

};
</script>

<style>
</style>


