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
		path: '/:id/:name?/projection',
		component: ProjectionStage,
		props: true,
	},
	{
		name: 'livinglab',
		path: '/:id/:name?/livinglab',
		component: ProjectionStage,
		props: true,
	},
	{
		name: 'dashboard',
		path: '/:id/:name?/dashboard',
		component: ProjectionStage,
		props: true,
	},
	{
		name: 'theoryofchange',
		path: '/:id/:name?/theory-of-change',
		component: TheoryOfChange,
		props: true,
	},
	{
		name: 'communityreporting',
		path: '/:id/:name?/community-reporting',
		component: CommunityReporting,
		props: true,
	},
	{
		name: 'livinglabmodels',
		path: '/:id/:name?/living-lab-models',
		component: LivingLabModels,
		props: true,
	},
	{
		name: 'social',
		path: '/:id/:name?/social',
		component: SocialMedia,
		props: true,
	},
]

const router = new VueRouter({
	base: '/cosmos/',
	mode: 'history',
	routes,
});

export default router;
