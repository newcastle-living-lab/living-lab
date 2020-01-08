import Vue from 'vue';
import VueRouter from 'vue-router';

import ProjectionStage from '../components/ProjectionStage.vue';

Vue.use(VueRouter);

const Projects = { template: '<div>Projectlist</div>' }
// const Projection = { template: '<div>Projection canvas</div>' }
const SocialMedia = { template: '<div>Social media</div>' }

const routes = [
	{ path: '/projects', component: Projects,  name: 'projects', },
	{ path: '/:id/projection', component: ProjectionStage, name: 'projection' },
	{ path: '/:id/social', component: SocialMedia, name: 'social' }
]

const router = new VueRouter({
	routes
});

export default router;
