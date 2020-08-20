<template>
	<aside class="app-sidebar-edit" v-show="showSidebar">
		<div class="scrollable scr-y">
			<SidebarPanel
				v-for="(panel, idx) in panels"
				:key="panel.id"
				:panel="panel"
				:hasNext="idx < (numPanels-1)"
				:currentPanel="currentPanel"
				@set-current="setCurrentPanel"
				@go-next="goNextPanel"
			/>
		</div>
	</aside>
</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

import Vue from 'vue';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';

import Templates from '@/templates';

import SidebarPanel from './SidebarPanel';

export default {

	components: {
		SidebarPanel
	},

	data() {
		return {
			currentPanel: 'meta',
		}
	},

	computed: {

		...get([
			'userCanEdit',
			'isEditing',
			'project',
		]),

		definitions() {
			if ( ! this.project.id) {
				return [];
			}
			var template = Templates.get(this.project.template);
			return template.DEFINITIONS;
		},

		showSidebar() {
			return (this.userCanEdit && this.isEditing);
		},

		panels() {

			var panels = map(this.definitions, (def) => {
				return {
					modelPath: `project@data.${def.id}`,
					id: def.id,
					editor: `${def.type}-editor`,
					definition: def,
				}
			});

			panels.unshift({
				modelPath: `project`,
				id: "meta",
				editor: "meta-editor",
				title: "Project",
			});

			return panels;
		},

		numPanels() {
			return this.panels.length;
		}
	},

	methods: {

		// Change current panel to specific ID
		setCurrentPanel(id) {
			this.currentPanel = id;
		},

		// Go to the next panel after the supplied ID
		goNextPanel(id) {
			// find index of current panel ID
			var idx = findIndex(this.panels, { id: id }),
				nextIdx = 0;
			// Increment to get next one
			if (idx < this.numPanels-1) {
				nextIdx = idx + 1;
			}
			this.setCurrentPanel(this.panels[nextIdx].id);
		}
	}

}
</script>
