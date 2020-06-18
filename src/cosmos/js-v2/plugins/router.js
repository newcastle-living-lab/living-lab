import Vue from 'vue';
import VueRouter from 'vue-router';

import IndexPage from '@/pages/IndexPage';
import ProjectPage from '@/pages/ProjectPage';
import DashboardTab from '@/pages/ProjectPage/DashboardTab';
import TheoryOfChangeTab from '@/pages/ProjectPage/TheoryOfChangeTab';
import SocialMediaTab from '@/pages/ProjectPage/SocialMediaTab';
import CommunityReportingTab from '@/pages/ProjectPage/CommunityReportingTab';
import LivingLabModelsTab from '@/pages/ProjectPage/LivingLabModelsTab';
import JsonTab from '@/pages/ProjectPage/JsonTab';

Vue.use(VueRouter);

const routes = [
	{
		name: 'home',
		path: '/',
		component: IndexPage,
	},
	{
		path: '/:id/:name?',
		component: ProjectPage,
		props: true,
		children: [
			{ path: '', name: 'project_index', component: DashboardTab },
			{ path: 'dashboard', name: 'dashboard', component: DashboardTab },
			{ path: 'theory-of-change', name: 'theory_of_change', component: TheoryOfChangeTab },
			{ path: 'social', name: 'social_media', component: SocialMediaTab },
			{ path: 'community-reporting', name: 'community_reporting', component: CommunityReportingTab },
			{ path: 'living-lab-models', name: 'living_lab_models', component: LivingLabModelsTab },
			{ path: 'json', name: 'json', component: JsonTab },
		]
	},
]

const router = new VueRouter({
	base: '/cosmos-2/',
	mode: 'history',
	routes,
});

export default router;
