
<template>
	<div v-if="features.userGuide && userGuide.isOpen && steps.length > 0" class="user-guide">

		<template v-for="(step, idx) in steps">
			<div class="tile" v-if="userGuide.currentStep === idx">
				<div class="tile-icon">
					<InfoIcon size="48" v-show="step.type === 'info'" />
					<QuestionIcon size="48" v-show="step.type === 'question'" />
				</div>
				<div class="tile-content">
					<div class="tile-title">{{ userGuide.currentStep }}. {{ step.title }}</div>
					<a href="#" class="text-small mt-2 d-inline-block" @click.prevent="close()" v-if="userGuide.currentStep === 0">Skip user guide</a>
				</div>
				<div class="tile-action">
					<button class="btn btn-grey" :class="userGuide.currentStep === 0 ? 'disabled' : ''" :disabled="userGuide.currentStep === 0" type="button" @click.prevent="prev()"><BackIcon size="16" /> {{ labels.BACK }}</button>
					<button v-show="userGuide.currentStep !== steps.length - 1" class="btn btn-success" @click.prevent="next()">{{ labels.NEXT }} <NextIcon size="16" /></button>
					<button v-show="userGuide.currentStep === steps.length - 1" class="btn btn-primary" @click.prevent="close()"><CheckIcon size="16" /> {{ labels.CLOSE }}</button>
				</div>
			</div>
		</template>

	</div>
</template>

<script>

import { get, sync, dispatch } from 'vuex-pathify';

import NextIcon from 'vue-feather-icons/icons/ArrowRightIcon';
import BackIcon from 'vue-feather-icons/icons/ArrowLeftIcon';
import CheckIcon from 'vue-feather-icons/icons/CheckIcon';
import InfoIcon from 'vue-feather-icons/icons/InfoIcon';
import QuestionIcon from 'vue-feather-icons/icons/MessageSquareIcon';

import Aspects from '@/aspects';

const labels = {
	BACK: 'Back',
	NEXT: 'Next',
	CLOSE: 'Close',
};

export default {

	name: 'UserGuide',

	components: {
		NextIcon,
		BackIcon,
		CheckIcon,
		InfoIcon,
		QuestionIcon,
	},

	props: {
		'projectId': [Boolean, String, Number],
		'aspectId': [String, Boolean],
	},

	data() {
		return {
			labels: labels,
		}
	},

	computed: {

		...get(['features']),

		...sync([
			'userGuide',
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

		steps() {
			return this.aspect && this.aspect.Guide ? this.aspect.Guide.steps : [];
		},

		stepCount() {
			return this.steps.length
		}

	},

	methods: {

		next() {
			if (this.userGuide.currentStep < this.steps.length - 1) {
				this.userGuide.currentStep++;
			} else {
				this.userGuide.currentStep = 0;
			}
		},

		prev() {
			if (this.userGuide.currentStep > 0) {
				this.userGuide.currentStep--;
			} else {
				this.userGuide.currentStep = this.steps.length - 1;
			}
		},

		close() {
			dispatch('finishUserGuide', { projectId: this.projectId, aspectId: this.aspectId });
		},

		stepClasses(step) {
			return [`user-guide-step-${step.type}`];
		}

	}

}
</script>
