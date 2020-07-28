<template>

	<main ref="container" class="app-content light moral-summary">
		<div :class="isEditing ? 'scrollable scr-y' : ''">
			<div class="container grid-xl">
				<h1 class="h4 mb-8 mt-4">{{ project.data.model.title }}</h1>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">Define Ethos</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ definitionsById.defineEthos.children.values.label }}</td>
									<td class="group-value like-pre">{{ project.data.defineEthos.values }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.defineEthos.children.definedBy.label }}</td>
									<td class="group-value">{{ optionListLabel(definitionsById.defineEthos.children.definedBy, project.data.defineEthos.definedBy) }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.defineEthos.children.evidenceUrl.label }}</td>
									<td class="group-value"><EvidenceLink :url="project.data.defineEthos.evidenceUrl" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">Plan &amp; Manage</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ definitionsById.planManagePrior.children.actions.label }}</td>
									<td class="group-value">{{ project.data.planManagePrior.actions }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.planManagePrior.children.actors.label }}</td>
									<td class="group-value">
										<StakeholderTile
											v-for="(actor, idx) in project.data.planManagePrior.actors"
											:key="idx"
											:stakeholder="actor"
										/>
									</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.planManagePrior.children.evidenceUrl.label }}</td>
									<td class="group-value"><EvidenceLink :url="project.data.planManagePrior.evidenceUrl" /></td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.planManageCurrent.children.actions.label }}</td>
									<td class="group-value like-pre">{{ project.data.planManageCurrent.actions }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.planManageCurrent.children.actors.label }}</td>
									<td class="group-value">
										<StakeholderTile
											v-for="(actor, idx) in project.data.planManageCurrent.actors"
											:key="idx"
											:stakeholder="actor"
										/>
									</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.planManageCurrent.children.evidenceUrl.label }}</td>
									<td class="group-value"><EvidenceLink :url="project.data.planManageCurrent.evidenceUrl" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">Deliver</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ definitionsById.deliver.children.method.label }}</td>
									<td class="group-value">{{ optionListLabel(definitionsById.deliver.children.method, project.data.deliver.method) }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.deliver.children.actors.label }}</td>
									<td class="group-value">
										<StakeholderTile
											v-for="(actor, idx) in project.data.deliver.actors"
											:key="idx"
											:stakeholder="actor"
										/>
									</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.deliver.children.evidenceUrl.label }}</td>
									<td class="group-value"><EvidenceLink :url="project.data.deliver.evidenceUrl" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">Govern</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ definitionsById.govern.children.actions.label }}</td>
									<td class="group-value like-pre">{{ project.data.govern.actions }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.govern.children.actors.label }}</td>
									<td class="group-value">
										<StakeholderTile
											v-for="(actor, idx) in project.data.govern.actors"
											:key="idx"
											:stakeholder="actor"
										/>
									</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.govern.children.outcomes.label }}</td>
									<td class="group-value like-pre">{{ project.data.govern.outcomes }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.govern.children.evolution.label }}</td>
									<td class="group-value like-pre">{{ project.data.govern.evolution }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.govern.children.improvements.label }}</td>
									<td class="group-value like-pre">{{ project.data.govern.improvements }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

			</div>
		</div>
	</main>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';
import find from 'lodash/find';

import Templates from "@/templates";
import StakeholderTile from './StakeholderTile';

const EvidenceLink = {
	props: {
		url: String
	},
	template: `<a class="link" :href="url" target="_blank">{{ url }}</a>`
};

export default {

	name: "MoralSummaryTab",

	components: {
		StakeholderTile,
		EvidenceLink,
	},

	computed: {

		...get([
			'project',
			'isEditing',
		]),

		template() {
			if ( ! this.project.id) {
				return false;
			}
			var template = Templates.get(this.project.template);
			return template;
		},

		definitionsById() {

			var defs = {};
			var children = {};

			this.template.DEFINITIONS.forEach(item => {
				if (item.children && Array.isArray(item.children)) {
					children = {};
					item.children.forEach(child => {
						children[child.id] = child;
					});
					item.children = children;
				}

				defs[item.id] = item;
			});

			return defs;
		},

	},

	methods: {

		optionListLabel(definitionObj, value) {
			var item = find(definitionObj.componentProps.options, { 'value': value });
			return item ? item.label : '(Unknown)';
		},

		nl2br(value) {
			return value.replace(/(?:\r\n|\r|\n)/g, '<br>');
		}

	}

}

</script>

<style lang="scss" scoped>
.group-title {
	font-size: 1.3rem;
	// line-height: 1;
	padding-top: .6rem;
}

.group-prompt {
	font-size: .8rem;
	font-weight: bold;
	width: 50%;
	vertical-align: top;
}

.group-value {
	vertical-align: top;

	.link,
	a.link {
		color: #0074D9;
		text-decoration: underline;
	}
}

.like-pre {
	white-space: pre;
}

table {
	margin-bottom: 2.4rem;
}

.divider {
	border-top-width: .1rem;
	height: .1rem;
}
</style>
