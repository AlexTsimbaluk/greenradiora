import Vue from 'vue';
import axios from 'axios';

import Utils from '@/Utils.js';
import P_Config from '@/P_Config.js';

export default new Vue({
	data () {
		return {
			playerTag: null,
			playingTime: null,

			playerState: {
				playlists: {},
				playlistsOrder: [],
				currentPlaylist: '',
				nowPlaying: {},
				volume: .27,
				paused: true,
				status: [],
				translated: false,

				searchString: '',
				searchResults: []
			},
		}
	},
	methods: {
		stateChanged () {
			// console.log('::PlayerState::stateChanged');
			// console.log(this.playerState);

			localStorage.setItem('playerState', JSON.stringify(this.playerState));

			// this.$emit('stateChanged', this.$data);
			this.$emit('stateChanged', this.playerState);
		},

		loader (visible) {
			this.$emit('loader', visible);
		},

		getAudioTag (id) {
			this.playerTag = document.getElementById(id);
			this.playerTag.volume = this.playerState.volume;
			return this.playerTag;
		},

		playStream (streamUrl) {
			Utils.logs('::PlayerState::playStream::');
			
			let self = this;

			this.playerTag.src = streamUrl;

		    /*this.playerTag.crossOrigin = 'anonymous';
			setTimeout(function(){
				this.playerTag.crossOrigin = 'anonymous';
		    }, 3000);*/

			this.audioBindAll(this.playerTag);

			let playPromise = this.playerTag.play();

	        if (playPromise !== undefined) {
				playPromise.then(function() {
					console.log('::playPromise::Success::Begin');

					// this.playerState.nowPlaying.playlist = this.playerState.currentPlaylist;
					// this.playerState.nowPlaying.track = _currentTrack;

					// this.stateChanged();
				}).catch(function() {
					console.log('::playPromise::Failed::Begin');
					self.stopStream();
				});
	        }

			this.playerState.paused = this.playerTag.paused;
			this.stateChanged();
		},

		stopStream () {
			Utils.logs('::PlayerState::stopStream::');
			this.playerTag.pause();
			this.playerState.paused = this.playerTag.paused;
			this.stateChanged();
		},

		setVolume (volume) {
			this.playerTag.volume = this.playerState.volume = volume;
			this.stateChanged();
		},

		getVolume () {
			return this.playerState.volume;
		},

		searchStation (text) {
			if(text.length == 0) return;

			let _s = JSON.parse(localStorage.getItem('stations'));

			let prevSearchString = this.playerState.searchString;

			this.playerState.searchString = text.toLowerCase();
			console.log(this.playerState.searchString);
			this.playerState.searchResults = [];
			
			this.stateChanged();

			for (let _k in _s) {
				let _st = _s[_k];

				for(let _p in _st) {
					if(_p == 'station_id') {
						continue;
					}

					let val = _st[_p].toLowerCase();

					if(val.indexOf(this.playerState.searchString) != -1) {

						this.playerState.searchResults.push(_st['station_id']);
						this.stateChanged();

						continue;
					}
				}
			}

			console.log(this.playerState.searchResults.length);
		},

		resetSearch () {
			this.playerState.searchResults = [];
			this.playerState.searchString = '';
			this.stateChanged();
		},

		checkStatus () {
			let _s = this.playerState.status;

			setTimeout(() => {
				if(_s == this.playerState.status) {
					this.playerState.status = '';
				}
			}, 1500);
		},

		setStatus (status) {
			// this.playerState.status = '';
			// this.playerState.status = status;
			// this.checkStatus();
			
			// console.log(this.playerState.status);

			if(this.playerState.status.length > 1) {
				this.playerState.status.shift();
				this.playerState.status.push(status);
			} else {
				this.playerState.status.push(status);
			}
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

		setCurrentPlaylist (playlist) {
			this.playerState.currentPlaylist = playlist;
			this.stateChanged();
		},

		deleteStation (station) {
			console.log(station.station_id);

			let plCur = this.playerState.playlists[this.playerState.currentPlaylist].tracks;
			this.playerState.playlists[this.playerState.currentPlaylist].tracks.splice(plCur.indexOf(+station.station_id), 1);
			this.stateChanged();
		},

	    audioBindAll (player) {
	    	player.addEventListener('abort', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('abort');
	     		this.loader(false);
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
	     		this.loader(false);
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
	     		this.loader(false);
	     		
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
	     		player.mozGetMetadata && console.log(player.mozGetMetadata());

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
	     		this.loader(false);

	     		console.log('pause::' +  player.paused);
	     		player.currentTime = 0;
	     		// playerState.paused = player.paused;
	        });
	        player.addEventListener('play', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('play');	     		
	     		this.loader(true);
	        });
	        player.addEventListener('playing', (e)=> {
	     		console.log('::Event.type::' + e.type);

	     		this.setStatus('playing');	     		
	     		// console.log(e);

	     		// playerState.paused = player.paused;

	     		this.loader(false);
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
	     		this.loader(false);
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

		if(localStorage.getItem('playerState') == undefined) {
			P_Config.init();

			this.playerState = Object.assign(this.playerState, P_Config.playerState);
			localStorage.setItem('playerState', JSON.stringify(this.playerState));
		} else {
			this.playerState = JSON.parse(localStorage.getItem('playerState'));
			// console.log(this.playerState);
			// console.log(this.playerState.status);
			this.playerState.paused = true;
			this.playerState.searchString = '';
			this.playerState.searchResults = [];
			this.stateChanged();
		}
	}
});
