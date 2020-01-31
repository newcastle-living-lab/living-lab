<template>

	<div class="accordion accordion-service" :open="editing">

		<label class="accordion-header" @click="doEdit"><i class="icon icon-arrow-right"></i>{{ item.label }}</label>
		<div class="accordion-body" >

			<div class="card">
				<div class="card-body">

					<div class="form-group">
						<label class="form-label label-sm" :for="'label' + type + index">Label</label>
						<input
							ref="label"
							:id="'label' + type + index"
							:value="item.label"
							v-focus="editing"
							@keyup.enter="doneEdit"
							@keyup.esc="cancelEdit"
							@input="touchModified"
							type="text"
							class="form-input input-sm"
							maxlength="255"
						>
					</div>

					<div class="form-group">
						<label class="form-label label-sm" :for="'url' + type + index">Web address</label>
						<input
							ref="url"
							:id="'url' + type + index"
							:value="item.url"
							@keyup.enter="doneEdit"
							@keyup.esc="cancelEdit"
							@input="touchModified"
							type="text"
							class="form-input input-sm"
							maxlength="255"
							placeholder="https://"
						>
					</div>

					<div class="form-group" v-if="images">
						<label class="form-label label-sm" :for="'image' + type + index">Image</label>
						<div class="dropbox" v-if="showUpload">
							<input
								type="file"
								class="form-input input-sm"
								:id="'image' + type + index"
								:disabled="isUploading"
								@change="filesChange($event.target.files)"
								accept="image/*"
							/>
							<p v-if="isInitial">
								Drag your image here to begin or click to browse
							</p>
							<p v-if="isUploading">
								Uploading image...
							</p>
						</div>

						<div v-if="images && imageUrl">
							<p>
								<img :src="imageUrl" class="img-responsive">
							</p>
							<a class="btn btn-dark btn-sm" href="javascript:void(0)" @click="removeImage()">Remove image</a>
						</div>

						<!--FAILED-->
						<div v-if="isFailed">
							<h6>Uploaded failed.</h6>
							<p>
								<a class="btn btn-dark btn-sm" href="javascript:void(0)" @click="reset()">Try again</a>
							</p>
							<pre>{{ uploadError }}</pre>
						</div>

					</div>

					<div v-if="modified">
						<button
							type="button"
							class="btn btn-sm btn-primary"
							@click="doneEdit()"
						>Save</button>
					</div>

				</div>
			</div>

		</div>
	</div>

</template>

<script>

import { mapActions } from 'vuex';

const STATUS_INITIAL = 0;
const STATUS_SAVING = 1;
const STATUS_SUCCESS = 2;
const STATUS_FAILED = 3;
const STATUS_REMOVED = 4;

export default {

	directives: {
		focus (el, { value }, { context }) {
			if (value) {
				context.$nextTick(() => {
					el.focus()
				})
			}
		}
	},

	props: [
		'images',
		'index',
		'item',
		'type',
		'editingItem',
	],

	data() {
		return {
			uploadedFile: null,
			uploadError: null,
			currentStatus: null,
			modified: false,
			itemImage: false,
		}
	},

	computed: {

		editing() {
			return this.item == this.editingItem
		},

		isInitial() {
			return this.currentStatus === STATUS_INITIAL;
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

		showUpload() {
			return this.images && ! this.currentImage && (this.isInitial || this.isUploading);
		},

		currentImage() {
			if ( ! this.images) {
				return false;
			}

			if (this.uploadedFile) {
				return this.uploadedFile.filename;
			}

			if (this.itemImage) {
				return this.itemImage;
			}

			return false;
		},

		imageUrl() {
			if ( ! this.currentImage) {
				return false;
			}
			return `/images/thumb/${this.currentImage}`;
		}

	},

	methods: {

		...mapActions('project', [
			'editExternal',
			'removeExternal'
		]),

		doEdit() {
			if (this.editingItem == this.item) {
				this.$emit('edit-item', null);
				return;
			}

			this.$emit('edit-item', this.item);
		},

		doneEdit() {

			const label = this.$refs.label.value.trim();
			const url = this.$refs.url.value.trim();
			const image = this.currentImage;

			const { item } = this;

			if ( ! label) {
				this.removeExternal(item);
			} else {
				this.editExternal({
					item,
					label,
					url,
					image
				});
				this.$emit('edit-item', null);
			}
		},

		cancelEdit(e) {
			this.$refs.label.value = this.item.label;
			this.$refs.url.value = this.item.url;
			this.itemImage = this.item.image;
			this.resetUpload();
			this.$emit('edit-item', null);
		},

		resetUpload() {
			this.currentStatus = STATUS_INITIAL;
			this.uploadedFile = null;
			this.uploadError = null;
		},

		filesChange(fileList) {

			if (fileList.length !== 1) {
				return;
			}

			const formData = new FormData();
			formData.append('image', fileList[0], fileList[0].name);
			this.doUpload(formData);
		},

		doUpload(formData) {

			this.currentStatus = STATUS_SAVING;
			this.itemImage = false;

			this.$api.uploadImage(formData)
				.then(res => {
					this.touchModified();
					this.uploadedFile = res;
					this.currentStatus = STATUS_SUCCESS;
				})
				.catch(err => {
					this.uploadError = err.response;
					this.currentStatus = STATUS_FAILED;
				});
		},

		removeImage() {
			this.touchModified();
			this.resetUpload();
			this.itemImage = false;
		},

		touchModified() {
			if (this.modified) {
				return;
			}

			this.modified = true;
		}

	},

	mounted() {
		this.resetUpload();
		this.itemImage = this.item.image;
	}

}
</script>
