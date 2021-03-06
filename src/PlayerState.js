import Vue from 'vue';

import axios from 'axios';

import { Observable } from 'rxjs';
import { of, from } from 'rxjs';
import { fromPromise } from 'rxjs';

// https://stackoverflow.com/questions/45784825/frompromise-does-not-exist-on-type-observable/45785513
// import { fromPromise } from 'rxjs/observable/fromPromise';
// import 'rxjs/add/observable/fromPromise';


import PlayerData from '@/PlayerData.js';
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

			stationsArray: {},

			getMetaDataInterval: null,

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
				streamInfo: '',
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

		stationsChanged () {
			localStorage.setItem('stations', JSON.stringify(this.stationsArray));
			this.$emit('stationsChanged');
		},

		loader (visible) {
			this.$emit('loader', visible);
		},

		getAudioTag (id) {
			console.log('::PlayerState::getAudioTag');
			this.playerTag = document.getElementById(id);
			this.playerTag.volume = this.playerState.volume;

			console.log('+++ PlayerState:audioTag received successfully');
			
			this.initAnimations();
			this.initStationsArray();

			return this.playerTag;
		},

		initStationsArray () {
			console.log('::PlayerState::initStationsArray');
			this.stationsArray = JSON.parse(localStorage.getItem('stations'));
		},

		initAnimations () {
			console.log('::PlayerState::initAnimations');
			let _a = Object.keys(this.playerState.animations);

			if(!Object.keys(this.playerState.animationState).length && _a.length) {
				for (let key in this.playerState.animations) {
					Vue.set(this.playerState.animationState, this.playerState.animations[key].name, false);
				}
			}
		},

		playStream (track) {
			Utils.logs('::PlayerState::playStream::');
			
			let self = this;
			this.playerState.streamInfo = '';

			/*let prefixUrl = 'https://cross-origin.com/' + track.station_url;

			let deleted = 'http://';

			if(prefixUrl.indexOf(deleted) != -1) {
				let from = prefixUrl.indexOf(deleted);
				prefixUrl = prefixUrl.split('');
				prefixUrl.splice(from, deleted.length);
				prefixUrl = prefixUrl.join('');
			}*/

			this.playerTag.src = track.station_url.original;

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
					
					Utils.logs(`Playing ${track.station_title.original}`);

					self.getMetaDataInterval = setInterval(() => {
						self.getMetaData(self.playerTag.src);
					}, 15000);		
				}).catch(function() {
					// TODO: src = "https://cross-origin.com/myvideo.html" - ?

					// Event.type: error
					Utils.logs('::playPromise::Failed::Begin');
					// Event.type: pause
					self.stopStream();
				});
	        }

			this.playerState.paused = this.playerTag.paused;
			this.stateChanged();
		},

		stopStream () {
			Utils.logs('::PlayerState::stopStream::');

			clearInterval(this.getMetaDataInterval);

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
			this.playerState.streamInfo = '';
			this.setDocumentTitle(false);
			this.stateChanged();
		},

		createAnimations(animation) {
			Vue.set(this.playerState.animations, animation.name, animation);
		},

		enableAnimation(name, start) {
			if(start) {
				this.playerState.animations[name].start();
				this.playerState.animationState[name] = true;
			} else {
				this.playerState.animationState[name] = false;
				this.playerState.animations[name].stop();
			}
		},

		toggleAnimation (event, animation) {
			if(!this.playerState.animationState[animation.name]) {
				console.log(animation.name + ' start');

				Object.keys(this.playerState.animationState).forEach((_a) => {
					if(this.playerState.animationState[_a]) {
						console.log(_a + ' stop');
						console.log(this.playerState.animationState[_a]);

						this.playerState.animationState[_a] = false;
						this.playerState.animations[_a].stop();
					}
				});

				this.enableAnimation(animation.name, true);
			} else if(this.playerState.animationState[animation.name]) {
				console.log(animation.name + ' stop');

				this.enableAnimation(animation.name, false);
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
			axios
				.get('http://vuea.radiora.ru/api/icecast.php?url=' + streamingUrl)
				.then((response) => {
					// console.log(response.data);
					this.playerState.streamInfo = response.data[0];

					this.stateChanged();
				})
				.catch((error) => {
					console.log('Error::не удалось создать ajax-запрос');
					console.log('::Ajax failed');
					console.log(error)
				});
		},

		setCurrentPlaylist (playlist, d) {
			Utils.logs(d);
			this.playerState.currentPlaylist = playlist;

			if(this.playerState.translated) {
				this.translateAll(true);
				this.stationsChanged();
			}

			this.stateChanged();

			Utils.logs(new Date().getTime() - d);
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
				document.title =  this.playerState.nowPlaying.track.station_title.original + '::Radiora';
				return;
			}

			document.title = 'Radiora';
		},

		deleteStation (station) {
			console.log('::' + station.station_title.original + ' from ' + this.playerState.currentPlaylist + ' playlist deleted');
			let plCur = this.getCurrentPlaylist();
			this.playerState.playlists[this.playerState.currentPlaylist].tracks.splice(plCur.indexOf(+station.station_id), 1);
			this.stateChanged();
		},

		addStation (station) {
			Utils.logs('::' + station.station_title.original + ' added to ' + this.playerState.currentPlaylist + ' playlist');
			
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

	     		this.getMetaData(this.playerTag.src);

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
			if(!this.playerState.translated) {
				this.playerState.translated = true;
				this.translateAll(true);
				console.log(Translater.decodeText('# Translater::Translated'));
			} else {
				this.playerState.translated = false;
				this.translateAll(false);
				console.log(Translater.decodeText('# Translater::Original'));
			}

			this.stateChanged();
			this.stationsChanged();
	    },

	    // TODO: ускорить
	    translateAll (needTranslate) {
	    	let ids = this.getCurrentPlaylist();

	    	for(let id in this.stationsArray) {
	    		if(!ids.some((el) => {return el == id})) continue;

	    		if(needTranslate) {
		    		this.stationsArray[id].station_title.translated = Translater.decodeText(
		    			this.stationsArray[id].station_title.original
		    		);

		    		this.stationsArray[id].station_url.translated = Translater.decodeText(
		    			this.stationsArray[id].station_url.original
		    		);
	    		} else {
	    			this.stationsArray[id].station_title.translated = '';
	    			this.stationsArray[id].station_url.translated = '';
	    		}
	    	}
	    },

	    cleanState () {
	    	this.playerState.paused = true;
	    	this.playerState.searchString = '';
	    	this.playerState.streamInfo = '';
	    	this.playerState.playlistEdit = -1;
	    	this.playerState.searchResults = [];
	    	this.playerState.nowPlaying = {};
	    	this.playerState.playlistNameError = -1;
	    	this.stateChanged();
	    }
	},
	created () {
		console.log('@@@ PlayerState:hook:created');


		Vue.set(this.playerState, 'animationState', {});

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
			
			// this.cleanState();
			this.playerState.paused = true;
			this.playerState.nowPlaying = {};
			this.playerState.streamInfo = '';
			this.playerState.searchString = '';
			this.playerState.searchResults = [];
			this.playerState.playlistEdit = -1;
			this.playerState.playlistNameError = -1;

			this.stateChanged();
		}

		document.addEventListener('keyup', (event) => {
			// console.log(event.keyCode);
			// console.log(event.which);
			// console.log(event.code);

			if(event.code == 'Space' || event.keyCode == 32) {
				if(this.playerState.paused) {
					let track = this.getCurrentTrack() || this.playerState.playlists[this.playerState.currentPlaylist].currentTrack;
					console.log('::PlayerState:playStream::' + track.station_url);

					this.playStream(track);
				} else {
					this.stopStream();
				}
			}

			if(event.code == 'ArrowUp' || event.keyCode == 38) {
				this.playerState.volume < 1
					&& this.setVolume(Utils.round(this.playerState.volume + 0.01, 2));
			}

			if(event.code == 'ArrowDown' || event.keyCode == 40) {
				this.playerState.volume >= 0.01
					&& this.setVolume(Utils.round(this.playerState.volume - 0.01, 2));
			}

			return false;
		});
	}
});
