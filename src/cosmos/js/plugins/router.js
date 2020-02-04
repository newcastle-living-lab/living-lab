import Vue from 'vue';
import VueRouter from 'vue-router';

import ProjectionStage from '../components/ProjectionStage.vue';
import SocialMedia from '../components/SocialMedia.vue';
import TheoryOfChange from '../components/TheoryOfChange.vue';
import CommunityReporting from '../components/CommunityReporting.vue';
import LivingLabModels from '../components/LivingLabModels.vue';

Vue.use(VueRouter);

const routes = [
	{
		name: 'home',
		path: '/',
	},
	{
		name: 'projection',
		path: '/:id/projection',
		component: ProjectionStage,
		props: true,
	},
	{
		name: 'livinglab',
		path: '/:id/livinglab',
		component: ProjectionStage,
		props: true,
	},
	{
		name: 'dashboard',
		path: '/:id/dashboard',
		component: ProjectionStage,
		props: true,
	},
	{
		name: 'theoryofchange',
		path: '/:id/theory-of-change',
		component: TheoryOfChange,
		props: true,
	},
	{
		name: 'communityreporting',
		path: '/:id/community-reporting',
		component: CommunityReporting,
		props: true,
	},
	{
		name: 'livinglabmodels',
		path: '/:id/living-lab-models',
		component: LivingLabModels,
		props: true,
	},
	{
		name: 'social',
		path: '/:id/social',
		component: SocialMedia,
		props: true,
	},
]

const router = new VueRouter({
	routes
});

export default router;
