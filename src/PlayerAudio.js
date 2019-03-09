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
			console.log(animation);
			// let key = Object.keys(animation)[0];
			Vue.set(this.animations, animation.name, animation);
			console.log(this.animations);
		},
		getAnimations() {
			return this.animations;
		}
	},
	created () {
		console.log('@@@ PlayerAudio:hook:created');
	}
});