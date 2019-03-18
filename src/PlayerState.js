import Vue from 'vue';

import axios from 'axios';

import { Observable } from 'rxjs';
import { of, from } from 'rxjs';
import { fromPromise } from 'rxjs';

// https://stackoverflow.com/questions/45784825/frompromise-does-not-exist-on-type-observable/45785513
// import { fromPromise } from 'rxjs/observable/fromPromise';
// import 'rxjs/add/observable/fromPromise';


import Utils from '@/Utils.js';
import P_Config from '@/P_Config.js';

// import PlayerAudio from '@/PlayerAudio.js';

import Translater from '@/core/translater/Translater.js';

export default new Vue({
	data () {
		return {
			playerTag: null,
			playingTime: null,
			DEFAULT_PLAYLIST_NAME: '___',

			playerState: {
				playlists: {
					'___': {
						name: '',
						tracks: [],
						currentTrack: {}
					}
				},
				playlistsOrder: [],
				currentPlaylist: '',
				nowPlaying: {},
				volume: .27,
				paused: true,
				status: '',
				translated: false,
				playlistNameError: -1,
				animations: {},
				// animationState: {}
			},

			sub$: null,
			promiseSource: null,
			promiseSourceState: null
		}
	},
	methods: {
		stateChanged () {
			/*return new Promise((resolve, reject) => {
				// console.log(this.playerState);
				// console.log(this.playerState.playlists[this.playerState.currentPlaylist]);
				// console.log(this.playerState.playlists[this.playerState.currentPlaylist].currentTrack.station_title);

				// localStorage.setItem('playerState', JSON.stringify(this.playerState));
				// this.$emit('stateChanged', this.playerState);

				localStorage.setItem('playerState', JSON.stringify(this.playerState));
				this.$emit('stateChanged', this.playerState);
			});*/

			return new Promise((resolve, reject) => {
				// console.log(this.playerState);
				resolve(this.playerState);

				localStorage.setItem('playerState', JSON.stringify(this.playerState));
				this.$emit('stateChanged', this.playerState);
			});
		},

		loader (visible) {
			this.$emit('loader', visible);
		},

		getAudioTag (id) {
			this.playerTag = document.getElementById(id);
			this.playerTag.volume = this.playerState.volume;

			console.log(this.animations);
			this.initAnimations();

			return this.playerTag;
		},

		playStream (track) {
			Utils.logs('::PlayerState::playStream::');
			
			let self = this;

			/*let prefixUrl = 'https://cross-origin.com/' + track.station_url;

			let deleted = 'http://';

			if(prefixUrl.indexOf(deleted) != -1) {
				let from = prefixUrl.indexOf(deleted);
				prefixUrl = prefixUrl.split('');
				prefixUrl.splice(from, deleted.length);
				prefixUrl = prefixUrl.join('');
			}*/

			this.playerTag.src = track.station_url;

		    this.playerTag.crossOrigin = 'anonymous';
			setTimeout(function(){
				this.playerTag.crossOrigin = 'anonymous';
		    }, 3000);

			this.audioBindAll(this.playerTag);

			let playPromise = this.playerTag.play();

			/*
				Event.type: abort
				emptied
				play
				waiting
				loadstart

					Error - catch().
						error

						pause
					
					Success - then().
						durationchange
						loadedmetadata
						loadeddata
						canplay
						
						playing


			*/


	        if (playPromise !== undefined) {
				playPromise.then(function() {
					// Event.type: playing

					console.log('::playPromise::Success::Begin');


					for (let key in self.playerState.animationState) {
						if(self.playerState.animationState[key]) {
							let _a = self.playerState.animations[key];
							// _a.stop();
							_a.start();
						}
					}

					self.setCurrentTrack(track);
					self.setNowPlaying(track);

					self.setDocumentTitle(true);
					
					Utils.logs(`Playing ${track.station_title}`);					
				}).catch(function() {
					// TODO: src = "https://cross-origin.com/myvideo.html" - ?

					// Event.type: error
					console.log('::playPromise::Failed::Begin');
					// Event.type: pause
					self.stopStream();
				});
	        }

			this.playerState.paused = this.playerTag.paused;
			this.stateChanged();
		},

		stopStream () {
			Utils.logs('::PlayerState::stopStream::');

			/*
				Event.type: pause

				seeking
				seeked
				canplay
				suspend
				canplaythrough
			*/

			// this.playerState.activeAnimation && this.playerState.animations[this.playerState.activeAnimation].stop();

			for (let key in this.playerState.animationState) {
				if(this.playerState.animationState[key]) {
					let _a = this.playerState.animations[key];
					_a.stop();
				}
			}

			this.playerTag.pause();
			this.playerState.paused = this.playerTag.paused;
			this.playerState.nowPlaying = {};
			this.setDocumentTitle(false);
			this.stateChanged();
		},

		createAnimations(animation) {
			Vue.set(this.playerState.animations, animation.name, animation);
		},

		initAnimations () {
			console.log(Object.keys(this.playerState.animations));
			console.log(Object.keys(this.playerState.animationState));

			let _a = Object.keys(this.playerState.animations);

			if(!Object.keys(this.playerState.animationState).length && _a.length) {
				console.log('! no init a');

				for (let key in this.playerState.animations) {
					console.log(this.playerState.animations[key].name);
					Vue.set(this.playerState.animationState, this.playerState.animations[key].name, false);
				}
				
				console.log(Object.keys(this.playerState.animationState));
				console.log((this.playerState.animationState));
			}
		},

		toggleAnimation (event, animation) {
			if(!this.playerState.animationState[animation.name]) {
				// console.log(animation.name + ' start');

				Object.keys(this.playerState.animationState).forEach((_a) => {
					if(this.playerState.animationState[_a]) {
						console.log(_a);
						console.log(this.playerState.animationState[_a]);

						this.playerState.animationState[_a] = false;
					}
				});

				this.playerState.animations[animation.name].start();
				this.playerState.animationState[animation.name] = true;
			} else if(this.playerState.animationState[animation.name]) {
				// console.log(animation.name + ' stop');

				this.playerState.animations[animation.name].stop();
				this.playerState.animationState[animation.name] = false;
			}
			// this.playerState.animationState[animation.name] = !this.playerState.animationState[animation.name];

			this.stateChanged();
		},

		togglePlaying (station) {
			if(this.playerState.paused) {
				this.playStream(station);
			} else if(this.playerState.playlists[this.playerState.currentPlaylist].currentTrack.station_id == station.station_id) {
				this.stopStream();
			} else {
				this.playStream(station);
			}
		},

		setVolume (volume) {
			this.playerTag.volume = this.playerState.volume = volume;
			this.stateChanged();
		},

		getVolume () {
			return this.playerState.volume;
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
			this.playerState.status = '';
			this.playerState.status = status;
			this.checkStatus();
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

		getCurrentPlaylist () {
			return this.playerState.playlists[this.playerState.currentPlaylist].tracks;
		},

		addPlaylist () {
			console.log(':::add playlist');

			let defaultName = new Date().getTime().toString().substr(6);

			let _p = {
				name: defaultName,
				tracks: [],
				currentTrack: {}
				/*setTracks: function set (val)  {
					let plLength = plCur.length;

					plCur.splice(plCur.length - 1, 0, +val);
					this.stateChanged();

					setTimeout(() => {
						let last = plCur.splice(plCur.length - 1, 1)[0];
						plCur.splice(plCur.length - 1, 0, last);
						this.stateChanged();
					}, 400);
				}*/
			};

			this.playerState.currentPlaylist = defaultName;
			this.playerState.playlistsOrder.push(defaultName);

			// this.playerState.playlists[defaultName] = _p;
			Vue.set(this.playerState.playlists, defaultName, _p);
			
			this.stateChanged();
		},

		deletePlaylist(playlistName, index, active) {
			Utils.logs('::Playlist ' + playlistName + ' deleted');

			if(active) {
				this.playerState.currentPlaylist =
					this.playerState.playlistsOrder[index - 1]
					|| this.playerState.playlistsOrder[index + 1]
					|| '';
			}

			delete this.playerState.playlists[playlistName];
			this.playerState.playlistsOrder.splice(index, 1);

			if(this.playerState.playlistsOrder.length == 0) {
				this.addPlaylist();
			}

			this.stateChanged();
		},

		// TODO
		editPlaylist(oldPlaylistName, newPlaylistName, index, active) {
			console.log(oldPlaylistName, newPlaylistName, index, active);

			this.playerState.playlistNameError = -1;

			this.playerState.playlistsOrder[index] = newPlaylistName;

			if(active) {
				this.setCurrentPlaylist(newPlaylistName);
			}

			let _playlist = this.playerState.playlists[oldPlaylistName];
			_playlist.name = newPlaylistName;

			Vue.set(this.playerState.playlists, newPlaylistName, _playlist);

			delete this.playerState.playlists[oldPlaylistName];

			this.stateChanged();
			Utils.logs('Playlist new name is ' + newPlaylistName);
		},

		setCurrentTrack (track) {
			this.playerState.playlists[this.playerState.currentPlaylist].currentTrack = track;
			this.stateChanged();
		},

		getCurrentTrack () {
			return this.playerState.playlists[this.playerState.currentPlaylist].currentTrack;
		},

		setNowPlaying (track) {
			this.playerState.nowPlaying.playlist = this.playerState.currentPlaylist;
			this.playerState.nowPlaying.track = track;
			this.stateChanged();
		},

		getNowPlaying () {
			return this.playerState.playlists[this.playerState.currentPlaylist].currentTrack;
		},

		setDocumentTitle (newTitle) {
			if(newTitle) {
				document.title =  this.playerState.nowPlaying.track.station_title + '::Radiora';
				return;
			}

			document.title = 'Radiora';
		},

		deleteStation (station) {
			console.log('::' + station.station_title + ' from ' + this.playerState.currentPlaylist + ' playlist deleted');
			let plCur = this.getCurrentPlaylist();
			this.playerState.playlists[this.playerState.currentPlaylist].tracks.splice(plCur.indexOf(+station.station_id), 1);
			this.stateChanged();
		},

		addStation (station) {
			Utils.logs('::' + station.station_title + ' added to ' + this.playerState.currentPlaylist + ' playlist');
			
			let plCur = this.getCurrentPlaylist();
			
			if(plCur.some((i) => { return i == station.station_id; })) {
				return false;
			}

			let plLength = plCur.length;

			plCur.splice(plCur.length - 1, 0, +station.station_id);
			this.stateChanged();

			setTimeout(() => {
				let last = plCur.splice(plCur.length - 1, 1)[0];
				plCur.splice(plCur.length - 1, 0, last);
				this.stateChanged();
			}, 1000);
		},

	    audioBindAll (player) {
	    	player.addEventListener('abort', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('abort');
	     		this.loader(false);
	        });
	        player.addEventListener('canplay', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('canplay');
	        });
	        player.addEventListener('canplaythrough', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('canplaythrough');
	        });
	        player.addEventListener('durationchange', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('durationchange');
	        });
	        player.addEventListener('emptied', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('emptied');
	     		// $(".spinner").hide();
	     		this.loader(false);
	        });
	        player.addEventListener('encrypted', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('encrypted');
	        });
	        player.addEventListener('ended', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('ended');
	        });
	        player.addEventListener('error', (e) => {
	     		console.log('# Event.type: ' + e.type);
	     		this.loader(false);
	        });
	        player.addEventListener('interruptbegin', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('interruptbegin');
	        });
	        player.addEventListener('interruptend', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('interruptend');
	        });
	        player.addEventListener('loadeddata', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('loadeddata');
	        });
	        player.addEventListener('loadedmetadata', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('loadedmetadata');
	     		player.mozGetMetadata && console.log(player.mozGetMetadata());

	     		// this.getMetaData(this.playerTag.src);
	        });
	        player.addEventListener('loadstart', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		// this.getMetaData(this.playerTag.src);
	     		this.setStatus('loadstart');
	        });
	        player.addEventListener('mozaudioavailable', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('mozaudioavailable');
	        });
	        player.addEventListener('pause', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('pause');
	     		this.loader(false);

	     		// console.log('pause::' +  player.paused);
	     		player.currentTime = 0;
	        });
	        player.addEventListener('play', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('play');	     		
	     		this.loader(true);
	        });
	        player.addEventListener('playing', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('playing');
	     		


	     		this.loader(false);
	        });
	        player.addEventListener('ratechange', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('ratechange');
	        });
	        player.addEventListener('seeked', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('seeked');
	        });
	        player.addEventListener('seeking', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('seeking');
	        });
	        /*player.addEventListener('timeupdate', (e) => {
	 			var time = Math.ceil(player.currentTime);
	 			
	 			var sec = ('0' + parseInt(Math.floor(time % 60))).slice(-2);
	 			var min = ('0' + parseInt((Math.floor(time / 60)) % 60)).slice(-2);
	 			// $('#player .time .minutes').html(min);
	 			// $('#player .time .seconds').html(sec);

	 			this.playingTime = min + ':' + sec;
	        });*/
	        player.addEventListener('stalled', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('stalled');
	     		this.loader(false);
	        });
	        player.addEventListener('suspend', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('suspend');
	        });
	        player.addEventListener('waiting', (e) => {
	     		console.log('# Event.type: ' + e.type);

	     		this.setStatus('waiting');
	        });
	    },

	    translate () {
			console.log(Translater.decodeText('translate TEXT'));
	    }
	},
	created () {
		console.log('@@@ PlayerState:hook:created');


		Vue.set(this.playerState, 'animationState', {});

		/*this.stateChanged = () => {
			return new Promise((resolve, reject) => {
				console.log(this.playerState);
				resolve(this.playerState);

				localStorage.setItem('playerState', JSON.stringify(this.playerState));
				this.$emit('stateChanged', this.playerState);
			});
		};*/


		/*this.sub$ = Observable.create((observer) => {
			console.log('');
			console.log('Observable created');

			this.stateChanged();

			observer.next(this.playerTag);
		});*/

		// https://stackoverflow.com/questions/45784825/frompromise-does-not-exist-on-type-observable/45785513

		// это работает
		/*this.promiseSource = from(new Promise(resolve => resolve('Hello World!')));
		const subscribe = this.promiseSource.subscribe(val => console.log(val));*/

		/*of(this.playerState).subscribe(
			(state) => {
				console.log('');
				console.log('PlayerState changed');
				console.log(state);
				// console.log(PlayerState.playerTag);
			},
			(err) => console.error('error:', err),
			() => console.log('Completed')
		);*/

		/*let sub = from(this.stateChanged()).subscribe(
			(val) => {
				console.log('');
				console.log('+ From fractal sub');
				console.log(val);
			},
			(err) => console.error('error:', err),
			() => console.log('completed')
		);*/


		if(localStorage.getItem('playerState') == undefined) {
			P_Config.init();

			// this.playerState = Object.assign({}, this.playerState, P_Config.playerState);

			for(let pl in P_Config.playerState.playlists) {
				let pls = P_Config.playerState.playlists;

				Vue.set(this.playerState.playlists, pl, pls[pl]);
			}
			delete this.playerState.playlists[this.DEFAULT_PLAYLIST_NAME];
			
			Vue.set(this.playerState, 'currentPlaylist', P_Config.playerState.currentPlaylist);
			Vue.set(this.playerState, 'playlistsOrder', P_Config.playerState.playlistsOrder);

			localStorage.setItem('playerState', JSON.stringify(this.playerState));
		} else {
			this.playerState = JSON.parse(localStorage.getItem('playerState'));
			// console.log(this.playerState);
			// console.log(this.playerState.status);
			this.playerState.paused = true;
			this.playerState.searchString = '';
			this.playerState.playlistEdit = -1;
			this.playerState.searchResults = [];
			this.playerState.nowPlaying = {};
			this.playerState.playlistNameError = -1;
			this.stateChanged();
		}
	}
});
