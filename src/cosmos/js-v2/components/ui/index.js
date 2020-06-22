/**
 * Based on Minimal-UI from https://github.com/pb10005/diagram-vue
 *
 * Also under MIT License.
 *
 */

import * as components from "./lib";

const UI = {
	install(Vue) {
		for (let key in components) {
			const component = components[key];
			Vue.component(component.name, component);
		}
	}
};

export default UI;
