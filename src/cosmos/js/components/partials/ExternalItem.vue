<template>

	<div :class="columnClasses">

		<div :class="cardClasses">
			<div class="card-header">
				<a v-if="href" :href="href" class="btn btn-primary float-right ml-4" target="_blank"><i class="icon icon-forward"></i></a>
				<div class="card-title h6">{{ item.label }}</div>
				<div class="card-subtitle">{{ visibleUrl }}&nbsp;</div>
			</div>
			<div class="card-image" v-if="imageUrl">
				<a :href="imageUrl" class="d-block" target="_blank">
					<img class="img-responsive" :src="imageThumbUrl" :alt="'Image for ' + item.label">
				</a>
			</div>

		</div>
	</div>

</template>

<script>

import { mapActions } from 'vuex';

export default {

	props: [
		'item',
		'type',
	],

	computed: {

		columnClasses() {
			let classes = [
				'column',
				'external-item-column',
			];

			switch (this.item.type) {
				case 'livlabmod':
					classes.push(...[
						'col-xs-12',
						'col-sm-12',
						'col-md-6',
						'col-lg-4',
						'col-xl-2',
						'col-2'
					]);
				break;

				default:
					classes.push(...[
						'col-xs-12',
						'col-sm-12',
						'col-md-6',
						'col-lg-4',
						'col-xl-4',
						'col-4',
					]);
			}

			return classes;
		},

		cardClasses() {
			let classes = ['card', 'card-external', 'card-type-' + this.item.type];
			return classes;
		},

		headerTag() {
			return this.item.url ? 'a' : 'div'
		},

		headerClasses() {
			let classes = ['card-header'];
			if (this.item.url) {
				classes.push('card-link');
			}
			return classes;
		},

		href() {
			return this.item.url ? this.item.url : false;
		},

		visibleUrl() {
			let matches = this.item.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
			return matches && matches[1];
		},

		imageUrl() {
			return this.item.image ? `/images/${this.item.image}` : false;
		},

		imageThumbUrl() {
			return this.item.image ? `/images/thumb/${this.item.image}` : false;
		},

	}

}
</script>
