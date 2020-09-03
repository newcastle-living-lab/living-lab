<template>

	<div>

		<div class="form-group">
			<label class="form-label" for="name">Name</label>
			<VInput type="text" id="name" v-model="value.name" />
		</div>

	</div>

</template>

<script>

export default {

	props: {
		value: {
			default() {
				return {
					name: null,
					template: null,
					created_at: null,
					modified_at: null,
				};
			}
		},
	},

	data() {
		return {
			previousValue: {
				name: null,
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

			const created_at = (new Date()).toLocaleDateString();
			const modified_at = (new Date()).toLocaleDateString();

			return {
				name: name,
				created_at: created_at,
				modified_at: modified_at,
			};
		}

	}

};
</script>

<style>
</style>


