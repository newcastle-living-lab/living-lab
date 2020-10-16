<template>

	<div class="card card-min card-import-project" v-if="userCanCreate">
		<div class="card-header">
			<div class="card-title">Import project</div>
		</div>
		<div class="card-body">
			<div class="card-content">

				<div class="dropbox mb-4" :class="dropClasses">
					<input
						type="file"
						class="form-input"
						id="upload"
						:disabled="isUploading"
						@change="filesChange($event.target.files)"
						@dragstart="fileDragStart"
						@dragover="fileDragStart"
						@dragenter="fileDragStart"
						@dragleave="fileDragStop"
						@dragend="fileDragStop"
						@drop="fileDragStop"
						accept=".zip, application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip"
					/>
					<p v-if="isInitial">
						Drag your CoSMoS project here to begin or click to browse.
					</p>
					<p v-if="isFailed" class="text-error">
						{{ uploadError }}
					</p>
					<p v-if="hasFile">
						{{ file.name }}
					</p>
					<div v-if="isUploading">
						<p>Processing...</p>
						<div class="loading mb-2"></div>
						<br>
					</div>
				</div>

				<p class="text-small text-gray">Note: You will be the owner of the project that is imported.</p>
			</div>
		</div>
		<div class="card-footer">
			<VButton
				class="btn-primary"
				@click="doImport"
				:disabled="!file"
				:class="(!file ? 'disabled' : '')"
			>Import</VButton>
		</div>
	</div>

</template>

<script>

import { get, commit } from 'vuex-pathify';

import Network from '@/services/Network';

const STATUS_INITIAL = 0;
const STATUS_SAVING = 1;
const STATUS_SUCCESS = 2;
const STATUS_FAILED = 3;
const STATUS_REMOVED = 4;
const STATUS_FILE = 5;

export default {

	data() {
		return {
			file: null,
			uploadError: null,
			currentStatus: null,
			dropping: false,
		}
	},

	computed: {

		...get([
			'userCanCreate',
		]),

		isInitial() {
			return this.currentStatus === STATUS_INITIAL;
		},

		hasFile() {
			return this.currentStatus == STATUS_FILE;
		},

		isUploading() {
			return this.currentStatus === STATUS_SAVING;
		},

		isSuccess() {
			return this.currentStatus === STATUS_SUCCESS;
		},

		isFailed() {
			return this.currentStatus === STATUS_FAILED;
		},

		isRemoved() {
			return this.currentStatus === STATUS_REMOVED;
		},

		dropClasses() {
			return {
				'is-dropping': this.dropping ? true : false
			}
		},

	},


	methods: {

		doImport() {
			const formData = new FormData();
			formData.append('file', this.file, this.file.name);
			this.doUpload(formData);
		},

		resetUpload() {
			this.currentStatus = STATUS_INITIAL;
			this.uploadError = null;
		},

		filesChange(fileList) {
			if (fileList.length !== 1) {
				return;
			}
			this.file = fileList[0];
			this.currentStatus = STATUS_FILE;
		},

		doUpload(formData) {

			this.currentStatus = STATUS_SAVING;

			Network.importProject(formData)
				.then(res => {
					if (res.success) {
						this.resetUpload();
						this.$router.push('/' + res.id + '/dashboard');
						commit('SET_TOAST', { message: 'The project has been imported successfully!', type: 'success', seconds: 4 });
					} else {
						this.currentStatus = STATUS_FAILED;
						this.uploadError = res.reason;
					}
				})
				.catch(err => {
					this.currentStatus = STATUS_FAILED;
					this.uploadError = "Unknown error.";
				});
		},

		fileDragStart() {
			if (this.dropping) {
				return;
			}
			this.dropping = true;
		},

		fileDragStop() {
			if (!this.dropping) {
				return;
			}
			this.dropping = false;
		},
	},


	mounted() {
		this.resetUpload();
	}

}
</script>
