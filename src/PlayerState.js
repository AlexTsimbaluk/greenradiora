import Vue from 'vue';

export default new Vue({
	data () {
		return {
			playerTag: null
		}
	},
	methods: {
		getAudioTag(id) {
			this.playerTag = document.getElementById(id);
			console.log(this.playerTag);
		}
	},
	created () {
		console.log('::PlayerState:hook:created');
	}
});
