<template>

	<section class="app-header">

		<nav class="navbar">

			<section class="navbar-section navbar-buttons">

				<router-link to='/' class='navbar-brand btn btn-link'>{{ appName }}</router-link>

				<span class='navbar-project btn btn-empty' v-if="project.id">{{ project.name }}</span>

				<button class='btn btn-link btn-sm'
					v-if="hasProject && userCanEdit"
					@click="doSave"
				><save-icon size="16" />Save</button>

				<div class="dropdown dropdown-download" v-if="hasProject">
					<button class='btn btn-link btn-sm dropdown-toggle' :disabled="activeTab != 'model'"><download-icon size="16" />Download <i class="icon icon-caret"></i></button>
					<ul class="menu">
						 <li class="menu-item"><a href="javascript:;" @click="doExportImage()">Image</a></li>
						 <li class="menu-item"><a href="javascript:;" @click="doExportPdf()">PDF</a></li>
					</ul>
				</div>

				<div class="saving-ui input-group input-inline">
					<div v-show="lastSave.waiting">
						<span class="loading mr-4"></span>
						<span>Saving...</span>
					</div>
					<div v-show="lastSavedString && ! lastSave.waiting">
						Last saved at {{ lastSavedString }}
					</div>
				</div>

			</section>

			<section class="navbar-section navbar-tabs">
				<div v-if="project && project.id" class="input-group input-inline mr-8">
					<button class="btn btn-sm btn-link"
						@click.prevent="startUserGuide()"
						v-if="userGuide.isAvailable && !userGuide.isOpen"
					>Show user guide</button>
				</div>
				<div v-if="project && project.id" class="input-group input-inline mr-8">
					<label class="form-switch input-sm" v-show="activeTab == 'model'">
						<input type="checkbox" v-model="scale">
						<i class="form-icon"></i> <span class="text-small">Scale to fit</span>
					</label>
				</div>

				<div class="input-group input-inline">
					<span v-if="hasUser"
						class="btn btn-empty btn-sm"
					><user-icon size="16" /> {{ user.username }}</span>
					<a v-if="!hasUser && requireAuth"
						class="btn btn-link btn-sm"
						:href="loginUrl"
					><key-icon size="16" /> Log in</a>
				</div>
			</section>

		</nav>

	</section>

</template>

<script>

import { get, sync, commit, dispatch } from 'vuex-pathify';
import format from 'date-fns/format';

import PlusIcon from 'vue-feather-icons/icons/PlusIcon';
import EditIcon from 'vue-feather-icons/icons/EditIcon';
import FolderIcon from 'vue-feather-icons/icons/FolderIcon';
import SaveIcon from 'vue-feather-icons/icons/SaveIcon';
import UserIcon from 'vue-feather-icons/icons/UserIcon';
import KeyIcon from 'vue-feather-icons/icons/KeyIcon';
import DownloadIcon from 'vue-feather-icons/icons/DownloadIcon';

import Aspects from '@/aspects';
import { EventBus } from '@/services/EventBus';

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
			'userCanEdit',
			'hasUser',
			'requireAuth',
			'user',
			'project',
			'lastSave',
			'userGuide',
		]),

		...sync([
			'scale',
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
		},

		lastSavedString() {
			if (this.lastSave.time) {
				return format(this.lastSave.time, 'HH:mm');
			}
			return false;
		},

		activeTab: function() {
			return this.$route.name;
		},

		/**
		 * Get aspect (ALL data - CONFIG + DEFS etc!) based on supplied editor ID
		 *
		 */
		aspect() {
			const aspectId = this.route.params.aspectId;
			if ( ! aspectId) {
				return null;
			}
			return Aspects.get(aspectId);
		},

		steps() {
			return this.aspect && this.aspect.Guide ? this.aspect.Guide.steps : [];
		},

		userGuideAvailable() {
			const hasGuide = (this.aspect && this.aspect.Guide && this.aspect.Guide.steps);
			return (hasGuide && this.guideCompleted);
		},

		userGuideStorageKey() {
			if ( ! this.project || ! this.aspect) {
				return null;
			}
			return `cosmos.ug.${this.project.id}.${this.aspect.CONFIG.id}`;
		}

	},

	methods: {

		doSave() {
			dispatch('saveProject', 'manual');
		},

		doExportImage() {
			EventBus.$emit('export', { target: 'image' });
		},

		doExportPdf() {
			EventBus.$emit('export', { target: 'pdf' });
		},

		startUserGuide() {
			dispatch('openUserGuide', {projectId: this.project.id, aspectId: this.aspect.CONFIG.id });
		},

	},

	mounted() {
		// this.setUserGuideData();
	}

}
</script>
