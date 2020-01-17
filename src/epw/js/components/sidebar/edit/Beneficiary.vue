<template>

	<div class="sidebar-item">

		<sidebar-heading :name="panelName" title="Beneficiary" />

		<div class="sidebar-content" v-show="visible">

			<div class="form-group">
				<label class="form-label" for="label">Label</label>
				<input class="form-input" id="label" v-model="labelModel" maxlength="255">
			</div>

			<div class="form-group">
				<label class="form-label" for="colour">Colour</label>
				<select class="form-select" v-model="colourModel">
					<option v-for="colour in filteredColours"
						:key="colour.name"
						:value="colour.value">{{ colour.name }}
					</option>
				</select>
			</div>

			<div class="form-group">
				<label class="form-label" for="comment">Comment</label>
				<textarea class="form-input" id="comment" rows="3" v-model="commentModel"></textarea>
			</div>

		</div>

		<div class="sidebar-footer" v-show="visible">
			<button
				type="button"
				class="btn btn-success"
				@click="next()"
			>Next</button>
		</div>

	</div>

</template>

<script>

import { mapState, mapGetters } from 'vuex';
import { mapPropsModels } from '../../../helpers/map-props-models.js';
import filteredColours from '../../../data/filteredColours.js';

export default {

	data() {
		return {
			none: 'none',
			panelName: 'beneficiary',
			filteredColours: filteredColours
		};
	},

	computed: {
		...mapState('app', {
			visible(state) {
				return state.editPanel == this.panelName
			},
		}),
		...mapGetters('project', ['beneficiary']),
		...mapPropsModels(['label', 'colour', 'comment'], {
			object: 'beneficiary'
		}),
	},

	methods: {
		updateValue(prop, value) {
			this.$store.commit('project/updateBeneficiary', { prop, value });
		},
		next() {
			this.$store.dispatch('app/setEdit', 'services');
		}
	}

}
</script>
