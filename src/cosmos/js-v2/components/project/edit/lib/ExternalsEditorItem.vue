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

					<VGroup :name="inputId('label')" label="Label" labelClass="label-sm">
						<VInput
							:id="inputId('label')"
							v-model="item.label"
							ref="label"
							type="text"
							maxlength="255"
							class="input-sm"
							@enter="doFinish"
							@esc="doFinish"
						/>
					</VGroup>

					<VGroup :name="inputId('url')" label="URL" labelClass="label-sm">
						<VInput
							:id="inputId('url')"
							v-model="item.url"
							ref="label"
							type="text"
							maxlength="255"
							class="input-sm"
							@enter="doFinish"
							@esc="doFinish"
						/>
					</VGroup>

					<VGroup :name="inputId('image')" label="Image" labelClass="label-sm" v-if="useImages">

						<div class="dropbox" v-if="showUpload" :class="dropClasses">
							<input
								type="file"
								class="form-input input-sm"
								:id="inputId('image')"
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

						<div v-if="useImages && imageUrl">
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

					</VGroup>

				</div>

				<div class="card-footer">
					<button
						type="button"
						class="btn btn-sm btn-primary"
						@click="doFinish"
					><i class="icon icon-check"></i> OK</button>
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

import { ElementMixin, HandleDirective  } from 'vue-slicksort';

import Network from '@/services/Network';

const STATUS_INITIAL = 0;
const STATUS_SAVING = 1;
const STATUS_SUCCESS = 2;
const STATUS_FAILED = 3;
const STATUS_REMOVED = 4;

export default {

	name: "ExternalsEditorItem",

	mixins: [ElementMixin],

	directives: {
		handle: HandleDirective
	},

	props: {
		index: Number,
		item: Object,
		editingItem: Object,
		definition: Object,
		useImages: Boolean,
		showHandle: Boolean,
	},

	data() {
		return {
			uploadError: null,
			currentStatus: null,
			modified: false,
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
			return this.useImages && ! this.currentImage && (this.isInitial || this.isUploading);
		},

		currentImage() {
			if ( ! this.useImages) {
				return false;
			}

			if (this.item.image) {
				return this.item.image;
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

		/**
		 * Generate an input ID for label+input combo
		 *
		 */
		inputId(forInput) {
			return `${this.definition.id}_${this.index}_${forInput}`;
		},

		/**
		 * Finish editing.
		 *
		 * If label is empty, delete item.
		 * Otherwise, set editingItem to nothing, to close the panel.
		 *
		 */
		doFinish() {

			if (this.item.label && this.item.label.trim().length === 0) {
				this.deleteItem();
				return;
			}

			this.$emit('edit-item', null);
		},

		/**
		 * Send event which will set the 'editingItem' to this item
		 *
		 */
		doEdit() {
			if (this.editingItem == this.item) {
				this.$emit('edit-item', null);
				return;
			}

			this.$emit('edit-item', this.item);
		},

		resetUpload() {
			this.currentStatus = STATUS_INITIAL;
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
			this.item.image = false;

			Network.uploadImage(formData)
				.then(res => {
					this.item.image = res.filename;
					this.currentStatus = STATUS_SUCCESS;
				})
				.catch(err => {
					this.uploadError = err.response;
					this.currentStatus = STATUS_FAILED;
				});
		},

		removeImage() {
			this.resetUpload();
			this.item.image = false;
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
	}

}
</script>
