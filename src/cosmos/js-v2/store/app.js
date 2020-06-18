import Vue from 'vue';

export const appStore = {

	debug: true,

	state: {
		appName: 'CoSMoS',
		isEditing: false,
		isLoading: false,
		config: {
			user: null,
			require_auth: true,
			version: null,
		},
		scale: false,
		toast: {
			message: null,
			type: null,
		}
	},
/*
	setEditing(value) {
		this.isEditing = value;
	},

	setLoading(value) {
		this.isLoading = value;
	},

	setConfig(value) {
		this.config = value;
	},

	setToast(type, message) {
		this.toast.type = type;
		this.toast.message = null;
	},
	*/
	requireAuth() {
		return (this.state.config.require_auth === true);
	},

	hasUser() {
		return this.state.config.user !== null && typeof this.state.config.user === 'object' && this.state.config.user.username;
	},

	hasEditRole() {
		return (this.hasUser() && this.state.config.user.roles.indexOf('edit') >= 0);
	},

	userCanEdit() {

		if (this.state.config.require_auth === false) {
			return true;
		}

		return this.hasUser() && this.hasEditRole();
	}


};
