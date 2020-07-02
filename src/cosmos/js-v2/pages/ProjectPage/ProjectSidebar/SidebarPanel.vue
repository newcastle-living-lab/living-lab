<template>

	<div class="sidebar-item">

		<h3 @click="setCurrent()" class="sidebar-heading clickable">{{ panelTitle }}</h3>

		<div class="sidebar-main" v-if="isVisible">

			<div class="sidebar-hint" v-if="hint">
				<info-icon size="16" />
				{{ hint }}
			</div>

			<component
				v-bind:is="componentName"
				v-model="model"
				:definition="definition"
			></component>

			<div class="sidebar-footer">
				<VButton @click="goNext()" v-if="hasNext" class="btn-success">Next</VButton>
			</div>
		</div>

	</div>

</template>

<script>

import Vue from 'vue';
import { get, set, sync, call } from 'vuex-pathify';
import InfoIcon from 'vue-feather-icons/icons/InfoIcon';

// @TODO: Put these in their own lib to `install` them.
import MetaEditor from '@/components/project/edit/MetaEditor';
import ModelEditor from '@/components/project/edit/definitions/ModelEditor';
import StakeholderEditor from '@/components/project/edit/definitions/StakeholderEditor';
import ExternalsEditor from '@/components/project/edit/definitions/ExternalsEditor';
import SocialEditor from '@/components/project/edit/definitions/SocialEditor';
import InfoEditor from '@/components/project/edit/definitions/InfoEditor';
Vue.component('meta-editor', MetaEditor);
Vue.component('model-editor', ModelEditor);
Vue.component('stakeholder-editor', StakeholderEditor);
Vue.component('externals-editor', ExternalsEditor);
Vue.component('social-editor', SocialEditor);
Vue.component('info-editor', InfoEditor);

export default {

	components: {
		InfoIcon
	},

	props: {
		currentPanel: String,
		panel: Object,
		hasNext: Boolean,
	},

	computed: {

		modelPath() {
			return this.panel.modelPath;
		},

		model: sync(':modelPath'),

		/*model() {
			return sync('project');
			// console.log(this.panel);
			// if (this.panel.definition) {
			// 	return sync(`project@data.${this.definition.id}`);
			// } else {
			// 	return sync('project');
			// }
		},*/

		// ...sync([
		// 	'project',
		// ]),

		definition() {
			return this.panel && this.panel.definition ? this.panel.definition : false;
		},

		isVisible() {
			return (this.currentPanel == this.panel.id);
		},

		componentName() {
			return this.panel.editor;
		},

		panelTitle() {
			return this.panel.title ? this.panel.title : this.definition.title
		},

		hint() {
			return this.definition && this.definition.hint ? this.definition.hint : false;
		}
	},

	methods: {
		setCurrent() {
			this.$emit('set-current', this.panel.id);
		},
		goNext() {
			this.$emit('go-next', this.panel.id);
		}
	}

}

</script>
