export const mapPropsModels = function(props = [], {object, method} = {}) {
	return props.reduce((obj, prop) => {
		const propModel = prop + 'Model'
		const computedProp = {
			get() {
				return object ? this[object][prop] : this[prop]
			},
			set(value) {
				if (method) {
					this[method](prop, value);
				} else {
					this.updateValue(prop, value);
				}
			}
		}
		obj[propModel] = computedProp
		return obj
	}, {})
}
