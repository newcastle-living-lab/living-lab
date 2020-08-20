<template>

	<section class="app-header">

		<nav class="navbar">

			<section class="navbar-section navbar-buttons">

				<router-link to='/' class='navbar-brand btn btn-link'>{{ appName }}</router-link>

				<span class='navbar-project btn btn-empty' v-if="project.id">{{ project.name }}</span>

				<!-- <button class='btn btn-link btn-sm'
					v-if="hasProject && userCanEdit"
					@click="doEdit"
				><edit-icon size="16" />Edit</button> -->

				<button class='btn btn-link btn-sm'
					v-if="hasProject && userCanEdit"
					@click="doSave"
				><save-icon size="16" />Save</button>

				<div class="dropdown dropdown-download" v-if="hasProject">
					<button class='btn btn-link btn-sm dropdown-toggle'><download-icon size="16" />Download <i class="icon icon-caret"></i></button>
					<ul class="menu">
						 <li class="menu-item"><a href="javascript:;" @click="doExportImage()">Image</a></li>
						 <li class="menu-item"><a href="javascript:;" @click="doExportPdf()">PDF</a></li>
					</ul>
				</div>

			</section>

			<section class="navbar-section navbar-tabs">
				<span v-if="hasUser"
					class="btn btn-empty btn-sm"
				><user-icon size="16" /> {{ user.username }}</span>
				<a v-if="!hasUser && requireAuth"
					class="btn btn-link btn-sm"
					:href="loginUrl"
				><key-icon size="16" /> Log in</a>
			</section>

		</nav>

	</section>

</template>

<script>

import { get, commit, dispatch } from 'vuex-pathify';

import { EventBus } from '@/services/EventBus';

import PlusIcon from 'vue-feather-icons/icons/PlusIcon';
import EditIcon from 'vue-feather-icons/icons/EditIcon';
import FolderIcon from 'vue-feather-icons/icons/FolderIcon';
import SaveIcon from 'vue-feather-icons/icons/SaveIcon';
import UserIcon from 'vue-feather-icons/icons/UserIcon';
import KeyIcon from 'vue-feather-icons/icons/KeyIcon';
import DownloadIcon from 'vue-feather-icons/icons/DownloadIcon';

export default {

	components: {
		PlusIcon,
		FolderIcon,
		EditIcon,
		SaveIcon,
		UserIcon,
		KeyIcon,
		DownloadIcon,
	},

	props: ['route'],

	computed: {

		...get([
			'appName',
			'isEditing',
			'userCanEdit',
			'hasUser',
			'requireAuth',
			'user',
			'project',
		]),

		hasProject() {
			return (this.route && this.route.params.id);
		},

		loginUrl() {
			let currentRoute = this.route.path;
			let path = top.location.pathname.replace(currentRoute, '');
			let uri = path + currentRoute;
			uri = uri.replace('//', '/');
			return '/login?ref=' + encodeURIComponent(uri);
		}

	},

	methods: {

		doEdit() {
			if (!this.isEditing)  {
				commit('START_EDITING');
			} else {
				commit('STOP_EDITING');
			}
		},

		doSave() {
			dispatch('saveProject', 'manual');
		},

		doExportImage() {
			EventBus.$emit('export', { target: 'image' });
		},

		doExportPdf() {
			EventBus.$emit('export', { target: 'pdf' });
		}

	}

}
</script>
