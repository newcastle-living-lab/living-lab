import Vue from 'vue';
import VueRouter from 'vue-router';

import IndexPage from '@/pages/IndexPage';
import ProjectPage from '@/pages/ProjectPage';
import DashboardTab from '@/pages/ProjectPage/DashboardTab';
import JsonTab from '@/pages/ProjectPage/JsonTab';
import TemplateTab from '@/pages/ProjectPage/TemplateTab';

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
			{ path: 'json', name: 'json', component: JsonTab },
			{ path: ':tab', name: 'template-tab', component: TemplateTab, props: true },
		]
	},
]

const router = new VueRouter({
	base: '/cosmos/',
	mode: 'history',
	routes,
});

export default router;
