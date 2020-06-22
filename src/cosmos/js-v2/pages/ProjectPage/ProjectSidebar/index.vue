<template>
	<aside class="app-sidebar" v-show="showSidebar">
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



// @TODO Move into template config
/*let templateDefs = {
	'service-model': [
		{
			id: "model",
			type: "model",
			title: "Model",
			hint: null,
		},
		{
			id: "drivers",
			type: "drivers",
			title: "Drivers and Motivations",
			hint: "What were / are the drivers and motivations of the project? Was it a statutory requirement, recognition of a need or demand, seizing an opportunity, addressing an inequality?",
		},
		{
			id: "policyDefiner",
			type: "stakeholder",
			title: "Policy Definer",
			hint: "Who are, or were, the definers of the service policies and the principles under which the service operates?",
		},
		{
			id: "specifier",
			type: "stakeholder",
			title: "Specifier and Designer",
			hint: "Who specifies / specified and designs / designed the service delivery processes and resources?",
		},
		{
			id: "deployer",
			type: "stakeholder",
			title: "Deployer",
			hint: "Who deploys / deployed and activates / activated those processes and resources?",
		},
		{
			id: "deliverer",
			type: "stakeholder",
			title: "Deliverer",
			hint: "Who is responsible for the delivery mechanism(s), channels and roles in your pilot?",
		},
		{
			id: "evaluator",
			type: "stakeholder",
			title: "Evaluator",
			hint: "Who is the evaluator(s) and governors of the service?",
		},
		{
			id: "user",
			type: "stakeholder",
			title: "User",
			hint: "Who is the direct user of the service?",
		},
		{
			id: "beneficiary",
			type: "stakeholder",
			title: "Beneficiary",
			hint: "Are there beneficiaries other than the direct user/participants? If so, who are they?",
		},
		{
			id: "initiator",
			type: "stakeholder",
			title: "Initiator",
			hint: "Who are, or were, the instigators who initiated your pilot activity?",
		},
	],
	'analytic-model': [
		{
			id: "model",
			type: "model",
			title: "Model",
			hint: null,
		},
		{
			id: "serviceDeliveryManager",
			type: "stakeholder",
			title: "Service Delivery Manager",
			hint: "Who is the Service Delivery Manager responsible for the Intervention?"
		},
		{
			id: "frontLineServiceDeliverer",
			type: "stakeholder",
			title: "Front-line Service Deliverer",
			hint: "Who is the Front-line Service Deliverer?"
		},
		{
			id: "user",
			type: "stakeholder",
			title: "Client / User",
			hint: "Who is the direct user of the service?"
		},
		{
			id: "serviceOrganisationManager",
			type: "stakeholder",
			title: "Service Organisation Manager",
			hint: "Who is the Service Organisation Manager for the Intervention?"
		},
		{
			id: "servicePolicyMaker",
			type: "stakeholder",
			title: "Service Policy Maker",
			hint: "Who are, or were, the definers of the service policies and the principles under which the service operates?"
		},
		{
			id: "instigatorsOfChange",
			type: "stakeholder",
			title: "Instigators of Change",
			hint: "Who are, or were, the instigators who initiated your intervention activity?"
		},
		{
			id: "changeMakers",
			type: "stakeholder",
			title: "Change Makers",
			hint: "Who are, or were, the instigators who initiated your intervention activity?"
		},
		{
			id: "subjectsOfChange",
			type: "stakeholder",
			title: "Subjects of Change",
			hint: "Who are the idenitified subjects of change within the intervention?"
		},
		{
			id: "broker",
			type: "stakeholder",
			title: "Broker",
			hint: "Is there an active Broker between the Instigators of Change and Change Makers? If so, who are they?"
		},
		{
			id: "changeTheorists",
			type: "stakeholder",
			title: "Change Theorists",
			hint: "Who are the Change Theorists for the Intervention?"
		},
		{
			id: "beneficiaries",
			type: "stakeholder",
			title: "Beneficiaries",
			hint: "Are there beneficiaries other than the direct user/participants? If so, who are they?"
		},
		{
			id: "victims",
			type: "stakeholder",
			title: "Victims",
			hint: "Are there any identified victims? If so, who are they?"
		},
	],
};*/



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
