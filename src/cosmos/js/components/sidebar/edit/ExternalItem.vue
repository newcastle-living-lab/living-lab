<template>

	<div class="accordion accordion-external" :open="editing" :class="editing ? 'is-open' : ''">

		<label class="accordion-header" @click="doEdit">
			<div class="tile tile-centered">
				<div class="tile-content">
					<div class="tile-title">{{ item.label }}</div>
				</div>
				<div class="tile-icon">
					<i class="icon icon-menu c-move" v-handle v-if="showHandle"></i>
				</div>
			</div>
		</label>

		<div class="accordion-body">

			<div class="card card-edit">

				<div class="card-body">

					<div class="form-group">
						<label class="form-label label-sm" :for="'label' + type + index">Label</label>
						<input
							ref="label"
							:id="'label' + type + index"
							:value="item.label"
							@keyup.enter="doneEdit"
							@keyup.esc="cancelEdit"
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
							type="text"
							class="form-input input-sm"
							maxlength="255"
							placeholder="https://"
						>
					</div>

					<div class="form-group" v-if="images">
						<label class="form-label label-sm" :for="'image' + type + index">Image</label>
						<div class="dropbox" v-if="showUpload" :class="dropClasses">
							<input
								type="file"
								class="form-input input-sm"
								:id="'image' + type + index"
								:disabled="isUploading"
								@change="filesChange($event.target.files)"
								@dragstart="fileDragStart"
								@dragover="fileDragStart"
								@dragenter="fileDragStart"
								@dragleave="fileDragStop"
								@dragend="fileDragStop"
								@drop="fileDragStop"

								accept="image/*"
							/>
							<p v-if="isInitial">
								Drag your image here to begin or click to browse
							</p>
							<div v-if="isUploading">
								<p>Uploading image...</p>
								<div class="loading mb-2"></div>
								<br>
							</div>
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

				</div>

				<div class="card-footer">
					<button
						type="button"
						class="btn btn-sm btn-primary"
						@click="doneEdit"
					><i class="icon icon-check"></i> Save</button>
					<button
						type="button"
						class="btn btn-sm btn-negative btn-action float-right"
						@click="deleteItem"
					><i class="icon icon-delete"></i></button>
				</div>

			</div>

		</div>
	</div>

</template>

<script>

import { mapActions } from 'vuex';
import { ElementMixin, HandleDirective  } from 'vue-slicksort';

const STATUS_INITIAL = 0;
const STATUS_SAVING = 1;
const STATUS_SUCCESS = 2;
const STATUS_FAILED = 3;
const STATUS_REMOVED = 4;

export default {

	mixins: [ElementMixin],

	directives: {
		handle: HandleDirective
	},

	props: [
		'images',
		'index',
		'item',
		'type',
		'storeProperty',
		'editingItem',
		'showHandle',
	],

	data() {
		return {
			uploadedFile: null,
			uploadError: null,
			currentStatus: null,
			modified: false,
			itemImage: false,
			dropping: false,
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
		},

		dropClasses() {
			return {
				'is-dropping': this.dropping ? true : false
			}
		},

	},

	methods: {

		...mapActions('project', [
			'editExternal',
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
				this.$emit('delete-item', this.item);
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
					this.uploadedFile = res;
					this.currentStatus = STATUS_SUCCESS;
				})
				.catch(err => {
					this.uploadError = err.response;
					this.currentStatus = STATUS_FAILED;
				});
		},

		removeImage() {
			this.resetUpload();
			this.itemImage = false;
		},

		deleteItem() {
			this.$emit('delete-item', this.item);
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
		this.itemImage = this.item.image;
	}

}
</script>
