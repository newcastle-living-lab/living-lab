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

				<button class='btn btn-link btn-sm'
					v-if="hasProject && hasUser"
					@click="doExportProject()"
				><share-icon size="16" />Export</button>

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
					><user-icon size="16" /> {{ user.email }}</span>
					<a v-if="!hasUser && requireAuth"
						class="btn btn-link btn-sm"
						:href="loginUrl"
					><key-icon size="16" /> Log in</a>
				</div>
			</section>

		</nav>

		<div class="modal modal-sm" :class="modal == 'export' ? 'active' : ''">
			<div class="modal-overlay"></div>
			<div class="modal-container">
				<div class="modal-header">
					<div class="modal-title h5">Exporting project...</div>
				</div>
				<div class="modal-body">
					<div class="content">
						<template>
							<p>Please wait while the file is being generated.</p>
							<div class="loading loading-lg mb-8"></div>
						</template>
						<!-- <template v-else>
							<div class="text-center mb-8" style="color: #2ecc40">
								<CheckIcon size="48" />
							</div>
							<a class="btn btn-primary btn-block" :href="exportData.url">Download file</a>
						</template> -->
					</div>
				</div>
			</div>
		</div>


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
import ShareIcon from 'vue-feather-icons/icons/Share2Icon';
import CheckIcon from 'vue-feather-icons/icons/CheckCircleIcon';

import Aspects from '@/aspects';
import { EventBus } from '@/services/EventBus';
import Network from '@/services/Network';

export default {

	components: {
		PlusIcon,
		FolderIcon,
		EditIcon,
		SaveIcon,
		UserIcon,
		KeyIcon,
		DownloadIcon,
		ShareIcon,
		CheckIcon,
	},

	props: ['route'],

	data() {
		return {
			'modal': false,
			exportError: null,
			exportData: null,
		}
	},

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
			return '/admin/account/login?ref=' + encodeURIComponent(uri);
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

		doExportProject() {
			this.modal = 'export';
			Network.exportProject(this.project.id)
				.then((res) => {
					if (res && res.success && res.url) {
						this.modal = false;
						top.location.href = res.url;
						return;
					}
					commit('SET_TOAST', { message: `Error: ${res.reason}`, type: 'error' });
				})
				.catch((err) => {
					commit('SET_TOAST', { message: `Error: ${err}`, type: 'error' });
				});
		},

	},

	mounted() {
		// this.setUserGuideData();
	}

}
</script>
