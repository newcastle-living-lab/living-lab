import Vue from 'vue';
import VueRouter from 'vue-router';

import IndexPage from '@/pages/IndexPage';
import ProjectPage from '@/pages/ProjectPage';
import DashboardTab from '@/pages/ProjectPage/DashboardTab';
import WelcomeTab from '@/pages/ProjectPage/WelcomeTab';
import JsonTab from '@/pages/ProjectPage/JsonTab';
import SummaryTab from '@/pages/ProjectPage/SummaryTab';
import ContainerTab from '@/pages/ProjectPage/ContainerTab';

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
			{ path: '/', name: 'project', component: WelcomeTab, props: { aspectId: 'welcome' } },
			{ path: 'json', name: 'json', component: JsonTab, props: true },
			{ path: ':aspectId/model', name: 'model', component: DashboardTab, props: true },
			{ path: ':aspectId/summary', name: 'summary', component: SummaryTab, props: true },
			{ path: ':aspectId', name: 'container', component: ContainerTab, props: true },
		]
	},
]

const router = new VueRouter({
	base: '/cosmos/',
	mode: 'history',
	routes,
});

export default router;
