import Vue from 'vue';
import Utils from '@/Utils.js';

export default new Vue({
	data () {
		return {
			playerTag: null,
			paused: true
		}
	},
	methods: {
		getAudioTag (id) {
			this.playerTag = document.getElementById(id);
			return this.playerTag;
		},
		playStream (streamUrl) {
			var self = this;
			Utils.logs('::PlayerState::playStream::');
			this.playerTag.src = streamUrl;

			var playPromise = this.playerTag.play();

	        if (playPromise !== undefined) {
				playPromise.then(function() {
					console.log('::playPromise::Success::Begin');
				}).catch(function() {
					console.log('::playPromise::Failed::Begin');
					self.stopStream();
				});
	        }

			this.paused = this.playerTag.paused;
		},
		stopStream () {
			Utils.logs('::PlayerState::stopStream::');
			this.playerTag.pause();
			this.paused = this.playerTag.paused;
		}
	},
	created () {
		console.log('::PlayerState:hook:created');
	}
});
