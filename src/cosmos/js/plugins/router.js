import Vue from 'vue';
import VueRouter from 'vue-router';

import ProjectionStage from '../components/ProjectionStage.vue';
import SocialMedia from '../components/SocialMedia.vue';

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
