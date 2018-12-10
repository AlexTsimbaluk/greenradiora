import Vue from 'vue';
import axios from 'axios';

import Utils from '@/Utils.js';

export default new Vue({
	data () {
		return {
			playerTag: null,
			paused: true,
			playingTime: null,
			status: ''
		}
	},
	methods: {
		stateChanged () {
			// console.log('::PlayerState::stateChanged');
			this.$emit('stateChanged', this.$data);
		},

		getAudioTag (id) {
			this.playerTag = document.getElementById(id);
			return this.playerTag;
		},

		playStream (streamUrl) {
			Utils.logs('::PlayerState::playStream::');
			
			var self = this;
			this.playerTag.src = streamUrl;

			this.audioBindAll(this.playerTag);

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
		},

		setStatus (status) {
			this.status = status;
			this.stateChanged();
		},

		getMetaData (streamingUrl) {
			console.log('getMetaData');

			/*axios
				.post(
					'/api/actions.php',
					{
						actions: 'getMetaData',
						url: streamingUrl
					}
				)
				// .get('/api/actions.php?url=' + streamingUrl)
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log('Error::не удалось создать ajax-запрос');
					console.log('::Ajax failed');
					// TODO: переделать на добавление класса объекту Vue
					console.log(error)
				});*/
		},

	    audioBindAll (player) {
	    	player.addEventListener('abort', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('abort');
	     		// $(".spinner").hide();
	        });
	        player.addEventListener('canplay', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('canplay');
	        });
	        player.addEventListener('canplaythrough', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('canplaythrough');
	        });
	        player.addEventListener('durationchange', (e)=> {
	     		// console.log('::Event.type::' + e.type);

	     		this.setStatus('durationchange');
	        });
	        player.addEventListener('emptied', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('emptied');
	     		// $(".spinner").hide();
	        });
	        player.addEventListener('encrypted', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('encrypted');
	        });
	        player.addEventListener('ended', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('ended');
	        });
	        player.addEventListener('error', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('error');
	     		console.log('Error::' + e.code +':: ' + e.message);
	     		// console.log(e);

	     		// $(".spinner").hide();
	     		
	     		/*if(playerState.paused) {
	     			console.log('paused');
	     			$('.track.waiting').
	     				removeClass('waiting').
	     				addClass('error-playing');
	     		}*/
	        });
	        player.addEventListener('interruptbegin', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('interruptbegin');
	        });
	        player.addEventListener('interruptend', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('interruptend');
	        });
	        player.addEventListener('loadeddata', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('loadeddata');
	        });
	        player.addEventListener('loadedmetadata', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('loadedmetadata');
	     		console.log(player.mozGetMetadata());

	     		this.getMetaData(this.playerTag.src);
	        });
	        player.addEventListener('loadstart', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.getMetaData(this.playerTag.src);
	     		this.setStatus('loadstart');
	        });
	        player.addEventListener('mozaudioavailable', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('mozaudioavailable');
	        });
	        player.addEventListener('pause', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('pause');

	     		console.log('pause::' +  player.paused);
	     		player.currentTime = 0;
	     		// playerState.paused = player.paused;
	        });
	        player.addEventListener('play', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('play');	     		
	     		// $(".spinner").show();
	        });
	        player.addEventListener('playing', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('playing');	     		
	     		// console.log(e);

	     		// playerState.paused = player.paused;

	     		// $(".spinner").hide();
	        });
	        player.addEventListener('ratechange', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('ratechange');
	        });
	        player.addEventListener('seeked', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('seeked');
	        });
	        player.addEventListener('seeking', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('seeking');
	        });
	        /*player.addEventListener('timeupdate', (e)=> {
	 			var time = Math.ceil(player.currentTime);
	 			
	 			var sec = ('0' + parseInt(Math.floor(time % 60))).slice(-2);
	 			var min = ('0' + parseInt((Math.floor(time / 60)) % 60)).slice(-2);
	 			// $('#player .time .minutes').html(min);
	 			// $('#player .time .seconds').html(sec);

	 			this.playingTime = min + ':' + sec;
	        });*/
	        player.addEventListener('stalled', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('stalled');
	     		// $(".spinner").hide();
	        });
	        player.addEventListener('suspend', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('suspend');
	        });
	        player.addEventListener('waiting', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('waiting');
	        });
	    }
	},
	created () {
		console.log('::PlayerState:hook:created');		
	}
});
