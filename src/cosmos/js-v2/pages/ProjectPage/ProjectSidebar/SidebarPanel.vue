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
				<VButton @click="goNext()" v-if="hasNext" class="btn btn-success btn-block">Next <i class="icon icon-arrow-down"></i></VButton>
			</div>
		</div>

	</div>

</template>

<script>

import Vue from 'vue';
import { get, set, sync, call } from 'vuex-pathify';
import InfoIcon from 'vue-feather-icons/icons/InfoIcon';

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
