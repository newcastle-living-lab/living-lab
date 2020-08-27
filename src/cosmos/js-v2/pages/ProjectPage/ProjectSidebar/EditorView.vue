<template>

	<div class="app-sidebar-edit">
		<div class="panel scrollable">
			<div class="panel-header px-0 py-0">
				<div class="tile tile-centered tile-template">
					<div class="tile-action">
						<button class="btn btn-action btn-link" @click.prevent="doEdit"><back-icon size="16" /></button>
					</div>
					<div class="tile-content">
						<div class="tile-title">{{ titleText }}</div>
					</div>
				</div>
			</div>
			<div class="panel-body px-0">
				<EditorPanel
					v-for="(panel, idx) in panels"
					:key="panel.id"
					:panel="panel"
					:hasNext="idx < (numPanels-1)"
					:currentPanel="currentPanel"
					@set-current="setCurrentPanel"
					@go-next="goNextPanel"
				/>
			</div>
		</div>
	</div>

</template>

<script>

import { get, set, sync, call, commit } from 'vuex-pathify';

import Vue from 'vue';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';

import BackIcon from 'vue-feather-icons/icons/CornerUpLeftIcon';

import Aspects from '@/aspects';

import EditorPanel from './EditorPanel';

export default {

	components: {
		BackIcon,
		EditorPanel,
	},

	props: {
		aspectId: String,
	},

	data() {
		return {
			currentPanel: 'meta',
		}
	},

	computed: {

		...get([
			'project',
			'aspectEditId',
		]),

		/**
		 * Get aspect (ALL data!) based on supplied editor ID
		 *
		 */
		aspect() {
			if ( ! this.aspectEditId) {
				return null;
			}
			return Aspects.get(this.aspectEditId);
		},

		/**
		 * Title text at the top of the panel UI.
		 * Based on aspect config, OR: project name if aspect = welcome
		 *
		 */
		titleText() {
			if ( ! this.aspect) {
				return '';
			}
			if (this.aspect.CONFIG.id === 'welcome') {
				return this.project.name;
			}

			return this.aspect.CONFIG.title;
		},

		definitions() {
			if (! this.project.id || ! this.aspect) {
				return [];
			}
			return this.aspect.DEFINITIONS;
		},

		panels() {

			if ( ! this.aspect) {
				return [];
			}

			const aspectId = this.aspect.CONFIG.id;

			var panels = map(this.definitions, (def) => {
				return {
					modelPath: `project@data.${aspectId}.${def.id}`,
					id: def.id,
					editor: `${def.type}-editor`,
					definition: def,
				}
			});

			if (this.aspect.CONFIG.id === 'welcome') {
				panels.unshift({
					modelPath: `project`,
					id: "meta",
					editor: "meta-editor",
					title: "Project",
				});
			}

			return panels;
		},


		numPanels() {
			return this.panels.length;
		}

	},

	methods: {

		doEdit() {
			commit('STOP_EDITING_ASPECT');
		},

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
	},

	mounted() {
		if (this.panels.length > 0) {
			this.setCurrentPanel(this.panels[0].id);
		}
	}

}
</script>
