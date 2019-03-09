import Vue from 'vue';

import PlayerData from '@/PlayerData.js';
import PlayerState from '@/PlayerState.js';

export default new Vue({
	data () {
		return {
			animations: {}
		}
	},
	methods: {
		createAnimations(animation) {
			Vue.set(this.animations, animation.name, animation);
		},
		getAnimations() {
			return this.animations;
		}
	},
	created () {
		console.log('@@@ PlayerAudio:hook:created');
	}
});