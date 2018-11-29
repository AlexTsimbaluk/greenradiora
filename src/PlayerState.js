import Vue from 'vue';
import Utils from '@/Utils.js';

export default new Vue({
	data () {
		return {
			playerTag: null,
			paused: true,
			playingTime: null
		}
	},
	methods: {
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
		getPlayingTime () {
			return this.playingTime;
		},
	    audioBindAll (player) {
	    	player.addEventListener('abort', (e)=> {
	     		console.log('::Event.type::' + e.type);
	     		// $(".spinner").hide();
	        });
	        player.addEventListener('canplay', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('canplaythrough', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('durationchange', (e)=> {
	     		// console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('emptied', (e)=> {
	     		console.log('::Event.type::' + e.type);
	     		// $(".spinner").hide();
	        });
	        player.addEventListener('encrypted', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('ended', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('error', (e)=> {
	     		console.log('::Event.type::' + e.type);
	     		console.log('Error::' + e.code +':: ' + e.message);
	     		console.log(e);

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
	        });
	        player.addEventListener('interruptend', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('loadeddata', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('loadedmetadata', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('loadstart', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('mozaudioavailable', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('pause', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		console.log('pause::' +  player.paused);
	     		player.currentTime = 0;
	     		// playerState.paused = player.paused;
	        });
	        player.addEventListener('play', (e)=> {
	     		console.log('::Event.type::' + e.type);
	     		// $(".spinner").show();
	        });
	        player.addEventListener('playing', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		// playerState.paused = player.paused;

	     		// $(".spinner").hide();
	        });
	        player.addEventListener('ratechange', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('seeked', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('seeking', (e)=> {
	     		console.log('::Event.type::' + e.type);
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
	     		// $(".spinner").hide();
	        });
	        player.addEventListener('suspend', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	        player.addEventListener('waiting', (e)=> {
	     		console.log('::Event.type::' + e.type);
	        });
	    }
	},
	created () {
		console.log('::PlayerState:hook:created');
	}
});
