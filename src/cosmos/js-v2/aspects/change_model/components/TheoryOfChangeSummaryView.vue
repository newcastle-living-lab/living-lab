<template>

	<main ref="container" class="app-content light moral-summary" v-if="aspectData">
		<div class="scrollable scr-y">
			<div class="container grid-xl">
				<h1 class="h4 mb-8 mt-4" v-if="aspectData.model">{{ aspectData.model.title }}</h1>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">First Order</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ definitionsById.first_order.children.vision.label }}</td>
									<td class="group-value like-pre">{{ aspectData.first_order.vision }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.first_order.children.plan.label }}</td>
									<td class="group-value like-pre">{{ aspectData.first_order.plan }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.first_order.children.execute.label }}</td>
									<td class="group-value like-pre">{{ aspectData.first_order.execute }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.first_order.children.measure.label }}</td>
									<td class="group-value like-pre">{{ aspectData.first_order.measure }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">Second Order</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ definitionsById.second_order.children.sense_making.label }}</td>
									<td class="group-value like-pre">{{ aspectData.second_order.sense_making }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.second_order.children.languaging.label }}</td>
									<td class="group-value like-pre">{{ aspectData.second_order.languaging }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.second_order.children.committing.label }}</td>
									<td class="group-value like-pre">{{ aspectData.second_order.committing }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">Third Order</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ definitionsById.third_order.children.processes.label }}</td>
									<td class="group-value like-pre">{{ aspectData.third_order.processes }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">Fourth Order!</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ definitionsById.fourth_order.children.unexpected_events.label }}</td>
									<td class="group-value like-pre">{{ aspectData.fourth_order.unexpected_events }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.fourth_order.children.event_cause.label }}</td>
									<td class="group-value like-pre">{{ aspectData.fourth_order.event_cause }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ definitionsById.fourth_order.children.change_origin.label }}</td>
									<td class="group-value like-pre">{{ aspectData.fourth_order.change_origin }}</td>
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

import Aspects from '@/aspects';

const EvidenceLink = {
	props: {
		url: String
	},
	template: `<a class="link" :href="url" target="_blank">{{ url }}</a>`
};

export default {

	name: "TheoryOfChangeSummaryView",

	components: {
		EvidenceLink,
	},

	props: {
		aspectId: [Boolean, String],
	},

	computed: {

		...get([
			'project',
		]),

		/**
		 * Get aspect (ALL data - CONFIG + DEFS etc!) based on supplied editor ID
		 *
		 */
		aspect() {
			const aspect = this.aspectId;
			if ( ! this.aspectId) {
				return null;
			}
			return Aspects.get(aspect);
		},


		dataPath() {
			return `project@data.${this.aspectId}`;
		},

		aspectData: get(':dataPath'),

		definitionsById() {

			var defs = {};
			var children = {};

			this.aspect.DEFINITIONS.forEach(item => {
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
