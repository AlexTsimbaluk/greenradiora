<template>
	<div class="player flex-grow mx-auto">
		<loader v-if="!xhrResponceRecieved || waiting"></loader>

		<div
			v-if="xhrResponceRecieved"
			class="d-flex flex-column h-100"
		>
			<div
				class="d-flex flex-shrink-0 justify-content-between current-track"
			>
				<transition name="flip" mode="out-in">
					<div
						v-if="!state.paused && state.nowPlaying.track"
						class="flex-grow-1 track-title"
					>
						{{state.nowPlaying.track.station_title}}
					</div>
				</transition>

				<div
					class="ml-auto mr-3 status"
				>
					<transition name="flip" mode="out-in">
						<div
							@click="state.status = ''"
							v-if="state.status"
							class="d-flex align-items-center"
						>
							{{state.status}}
						</div>
					</transition>
				</div>

				<transition name="flip" mode="out-in">
					<div
						v-if="!state.paused"
						class="d-flex align-items-center time"
					>
						{{playingTime}}
					</div>
				</transition>
			</div>

			<div class="d-flex flex-wrap flex-shrink-0 justify-content-between py-2 pb-2">
				<div
					class="d-flex"
				>
					<button
						class="btn btn-outline-info btn-fab btn-round"
						@click="playStream"
					>
						<m-icon
							class="md-24"
							:i="'play_arrow'"
							:t="'light'"
						></m-icon>
						<ripple></ripple>
					</button>

					<button
						class="btn btn-outline-info btn-fab btn-round"
						@click="stopStream"
					>
						<m-icon
							class="md-24"
							:i="'stop'"
							:t="'light'"
						></m-icon>
						<ripple></ripple>
					</button>
				</div>

				<div
					class="d-flex"
				>
					<input
						@change="setVolume($event)"
						v-model="state.volume"
						class="d-flex align-items-center"
						type="range"
						min="0"
						max="1"
						step="0.01"
					/>

					<span class="ml-3 d-flex align-items-center">
						<!-- TODO: округлить до целых -->
						{{Math.round(state.volume * 100)}}
					</span>
				</div>
			</div>

			<div class="d-flex flex-shrink-0 row no-gutters py-2">
				<div
					class="d-flex col-12 col-sm-6 search-station"
				>
					<input
						@keyup="searchStation($event)"
						v-model="searchString"
						type="text"
						class="form-control search-station-input"
						placeholder="Search"
					/>
					
					<transition name="fade" mode="out-in">
						<div
							v-if="noSearchResults"
							key="notfinded"
							class="d-flex align-items-center h-100 position-absolute no-results"
						>
							No results :(
						</div>

						<div
							v-if="searchResults.length"
							key="finded"
							class="d-flex align-items-center h-100 position-absolute no-results"
						>
							{{searchResults.length}}
						</div>
					</transition>

					<transition name="fade" mode="out-in">
						<button
							v-if="searchResults.length"
							class="btn btn-info btn-link btn-fab btn-round position-absolute h-100 resetSearch"
							@click="resetSearch();"
						>
							<m-icon
								class="md-24"
								:i="'close'"
								:t="'light'"
							></m-icon>
							<ripple></ripple>
						</button>
					</transition>
				</div>
			</div>

			<div class="d-flex align-items-center flex-shrink-0 pb-2">
				<div class="d-flex flex-grow-1 playlists">
					<transition-group
						mode="out-in"
						enter-active-class="animated zoomIn faster"
					    leave-active-class="animated rotateOutDownLeft faster"
						class="d-flex w-100 o-y-hidden"
					>
						<div
							v-for="(playlist, index) in state.playlistsOrder"
							class="playlist"
							:class="[playlist == state.currentPlaylist ? 'active' : '']"
							:key="index"
						>
							<div class="row align-items-center w-100 mh-100 no-gutters position-relative">
								<div
									class="col-2 playlist-controls"
									@click.stop="deletePlaylist(playlist, index, playlist == state.currentPlaylist)"
								>
									<m-icon
										class="md-16"
										:i="'not_interested'"
										:t="'light'"
									></m-icon>
								</div>

								<div
									class="col-8 mh-100 position-static font-size-13"
								>
									<transition
										mode="out-in"
										enter-active-class="animated zoomIn faster"
									    leave-active-class="animated zoomOut faster"
									>
										<div
											v-if="playlistEdit != index"
											key="name"
											@click="setCurrentPlaylist(playlist)"
											class="w-100 o-x-hidden text-ellipsis playlist-title"
										>
											{{playlist}}
											<ripple></ripple>
										</div>

										<div
											v-if="playlistEdit == index"
											key="edit"
											class="w-100 h-100"
										>
											<input
												v-focus
												v-model="state.playlistsOrder[index]"
												@keyup.enter="toggleEditPlaylist(playlist, -1, playlist == state.currentPlaylist)"
												@change="playlistNameUpdated($event, playlist, index)"
												type="text"
												placeholder="Edit"
												class="form-control edit-playlist-input"
											/>
										</div>
									</transition>
								</div>

								<div
									class="col-2 playlist-controls"
									@click.stop="toggleEditPlaylist(playlist, index, playlist == state.currentPlaylist)"
								>
									<m-icon
										class="md-16"
										:i="'edit'"
										:t="'light'"
									></m-icon>
								</div>
							</div>
						</div>
					</transition-group>
				</div>

				<div class="flex-grow-0">
					<button
						class="btn btn-link btn-fab"
						@click="addPlaylist"
					>
						<m-icon
							class="md-24"
							:i="'add'"
							:t="'light'"
						></m-icon>
						<ripple></ripple>
					</button>
				</div>
			</div>

			<div
				class="d-flex flex-column flex-grow-1 no-gutters track-list-container"
			>
				<transition name="slide" mode="out-in">
					<div
						v-if="!searchFull"
						class="col pb-2 track-list"
					>
						<transition-group
							v-if="state.currentPlaylist && state.playlists[state.currentPlaylist] && state.playlists[state.currentPlaylist].tracks.length"
							name="flipinx"
							mode="in-out"
							enter-active-class="animated flipInY faster"
						    leave-active-class="animated slideOutRight faster"
						>
							<station
								v-for="(track, key) in state.playlists[state.currentPlaylist].tracks"
								:station="stationsArray[track]"
								:key="track"
								:class="{playing: state.nowPlaying.track && state.nowPlaying.track.station_id == track}"
							></station>
						</transition-group>
					</div>
				</transition>

				<transition name="slide" mode="out-in">
					<div
						v-if="searchResults.length"
						class="col d-flex flex-column no-gutters pt-2 search-list"
					>
						<div class="d-flex justify-content-between align-items-center">
							<div class="total-search">
								For query <span class="font-weight-bold">"{{searchString}}"</span> found <span class="font-weight-bold">{{searchResults.length}}</span> stations
							</div>

							<div class="">
								<button
									class="btn btn-link btn-fab"
									@click="searchFullToggle"
								>
									<m-icon
										v-if="searchFull"
										class="md-24"
										:i="'vertical_align_center'"
										:t="'light'"
									></m-icon>

									<m-icon
										v-else
										class="md-24"
										:i="'vertical_align_top'"
										:t="'light'"
									></m-icon>

									<ripple></ripple>
								</button>

								<button
									class="btn btn-link btn-fab"
									@click="resetSearch();"
								>
									<m-icon
										class="md-24"
										:i="'close'"
										:t="'light'"
									></m-icon>
									<ripple></ripple>
								</button>
							</div>
						</div>

						<div class="col o-y-auto">
							<station
								@addStation="scrollToBottom($event)"
								v-for="(track, key) in searchResults"
								:station="stationsArray[track]"
								:search="true"
								:key="track.station_id"
							></station>
						</div>
					</div>
				</transition>
			</div>
		</div>

		<audio id="playerTag" dynamicmetadata></audio>
	</div>
</template>

<script>
import Vue from 'vue';

import PlayerData from '@/PlayerData.js';
import PlayerState from '@/PlayerState.js';
import P_Config from '@/P_Config.js';
import Utils from '@/Utils.js';

import Log from '@/components/Log';
import Station from '@/components/Station';


Vue.component('Station', Station);


export default {
	name: 'Player',
	data () {
		return {
			xhrResponceRecieved: false,
			stationsArray: {},
			stationsArrayOn100: [],
			stationKeys: [],
			stTotal: 0,

			// random: null,
			// getRandomInt: Utils.getRandomInt,

			playing: false,
			playingTime: null,

			waiting: false,

			state: {},

			searchString: '',
			searchResults: [],
			noSearchResults: false,
			searchFull: false,

			playlistEdit: -1,
			playlistEditedIsActive: null,
			playlistOldName: ''
		}
	},
	methods: {
		dataTransfered () {
			Utils.logs('::Player:method:dataTransfered');

			this.stationsArray = JSON.parse(localStorage.getItem('stations'));
			this.makeOn100();
			// this.random = this.stationKeys[this.getRandomInt(0, this.stTotal)];

			this.xhrResponceRecieved = true;
		},
		makeOn100 () {
			// массив имен станций
			// нужен для правильного получения stationsIndex
			for (var key in this.stationsArray) {
				this.stationKeys.push(key);
			}
			this.stTotal = this.stationKeys.length;

			var totalArrays = Math.ceil(this.stTotal / 100);

			for (var i = 0; i < totalArrays; i++) {
				this.stationsArrayOn100[i] = [];
				for (var j = 0; j < 100; j++) {
					var stationsIndex = this.stationKeys[i * 100 + j];
					
					if(i == totalArrays - 1 && j == this.stTotal % 100) {
						break;
					}

					this.stationsArrayOn100[i][j] = this.stationsArray[stationsIndex];
				}
			}
		},
		playStream () {
			// TODO: проверить в новых/пустых плейлистах
			if(this.state.paused) {
				let track = PlayerState.getCurrentTrack() || this.state.playlists[this.state.currentPlaylist].currentTrack;
				console.log('::Player:playStream::' + track.station_url);

				PlayerState.playStream(track);
			}
		},
		stopStream () {
			PlayerState.stopStream();
		},
		setCurrentPlaylist (playlist) {
			playlist != this.state.currentPlaylist && PlayerState.setCurrentPlaylist(playlist);
		},
		setVolume (event) {
			let val = +event.target.value;
			PlayerState.setVolume(val);
		},
		searchStation (event) {
			let searchString = event.target.value;
			this.searchResults = [];
			this.noSearchResults = false;

			if(searchString.length < 3) {
				this.searchFull = false;
				return false;
			}

			this.searchString = searchString.toLowerCase();

			let _s = this.stationsArray;

			this.waiting = true;

			for (let _k in _s) {
				let _st = _s[_k];

				for(let _p in _st) {
					if(_p == 'station_id') {
						continue;
					}

					let val = _st[_p].toLowerCase();

					if(val.indexOf(this.searchString) != -1) {
						this.searchResults.push(_st['station_id']);
						continue;
					}
				}
			}

			this.waiting = false;

			Utils.logs(this.searchResults.length);

			if(this.searchResults.length == 0) {
				this.noSearchResults = true;
			}
		},
		resetSearch () {
			this.searchResults = [];
			this.noSearchResults = false;
			this.searchString = '';
			this.searchFull = false;
		},
		searchFullToggle () {
			this.searchFull = !this.searchFull;
		},
		addPlaylist () {
			PlayerState.addPlaylist();
		},
		scrollToBottom (event) {
			let $trackList = document.querySelector('.track-list');

			// $trackList.scrollTo({top: $trackList.scrollHeight, behavior: 'smooth'});
			// $trackList.scrollTo(0, $trackList.scrollHeight);
			$trackList.scrollTop = $trackList.scrollHeight;
		},
		deletePlaylist(playlistName, index, active) {
			PlayerState.deletePlaylist(playlistName, index, active);
		},
		toggleEditPlaylist(playlistName, index, active) {
			if(index == -1 || (this.playlistEdit == index)) {
				this.playlistEdit = -1;
				this.playlistOldName = '';
			} else if(this.playlistEdit != index) {
				this.playlistEdit = index;
				this.playlistOldName = playlistName;
			}

			this.playlistEditedIsActive = active;
			PlayerState.stateChanged();
		},
		playlistNameUpdated (event, playlistName, index) {
			PlayerState.editPlaylist(this.playlistOldName, playlistName, index, this.playlistEditedIsActive);
			this.playlistOldName = '';
			this.playlistEditedIsActive = null;
		}
	},
	created () {
		console.log('::Player:hook:created');

		PlayerData.$on('dataTransfer', () => {
			console.log('::Player:$on:dataTransfer');
			Utils.logs('::Data recieved');

			PlayerState.getAudioTag('playerTag');

			PlayerState.playerTag.addEventListener('timeupdate', (e)=> {
				var time = Math.ceil(PlayerState.playerTag.currentTime);

				var sec = ('0' + parseInt(Math.floor(time % 60))).slice(-2);
				var min = ('0' + parseInt((Math.floor(time / 60)) % 60)).slice(-2);

				this.playingTime = min + ':' + sec;
			});

			this.dataTransfered();

			this.state = PlayerState.playerState;
			// this.state.status = [];
			this.state.status = '';
		});

		PlayerState.$on('stateChanged', (state) => {
			// console.log('::Player:$on:PlayerState:stateChanged');
			// console.log(state);

			this.state = state;
		});

		PlayerState.$on('loader', (visible) => {
			console.log('::Player:$on:PlayerState:loader');
			
			this.waiting = visible;
		});
	}
}
</script>

<style>
	.current-track {
		height: 24px;
	}

	.status {
		cursor: default;
		/*transition: all .3s;*/
		position: relative;
	}

	.playlist-enter-active {
		animation: playlist-in 0.4s;
	}
	.playlist-leave-active {
		animation: playlist-out 0.4s;
	}

	@keyframes playlist-in {
		from {
			transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
			animation-timing-function: ease-in;
			opacity: 0;
		}

		40% {
			transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
			animation-timing-function: ease-in;
		}

		60% {
			transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
			opacity: 1;
		}

		80% {
			transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
		}

		to {
			transform: perspective(400px);
		}
	}

	@keyframes playlist-out {
		/* from {
			transform-origin: right bottom;
			opacity: 1;
		}
		
		  to {
			transform-origin: right bottom;
			transform: rotate3d(0, 0, 1, -45deg);
			opacity: 0;
		} */

		0% {
			transform: scale(1);
		}
		
		100% {
			transform: scale(0);
		}
	}

	.fade-enter-active {
		animation: fade-in .3s;
	}
	.fade-leave-active {
		animation: fade-out .3s;
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		
		100% {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		0% {
			opacity: 1;
		}
		
		100% {
			opacity: 0;
		}
	}

	.slide-enter-active {
		animation: slide-in .5s;
	}
	.slide-leave-active {
		animation: slide-out .5s;
	}

	@keyframes slide-in {
		0% {
			flex-grow: 0;
			/*transform: translateY(100%);*/
		}
		
		100% {
			flex-grow: 1;
			/*transform: translateY(0);*/
		}
	}

	@keyframes slide-out {
		0% {
			flex-grow: 1;
			/*transform: translateY(0);*/
		}
		
		100% {
			flex-grow: 0;
			/*transform: translateY(100%);*/
		}
	}




	.flip-enter-active {
		animation: flip-in .3s;
	}
	.flip-leave-active {
		animation: flip-out .3s;
	}

	@keyframes flip-in {
		0% {
			transform: scale(0);
		}
		
		100% {
			transform: scale(1);
		}
	}

	@keyframes flip-out {
		0% {
			transform: scale(1);
		}
		
		100% {
			transform: scale(0);
		}
	}

	.flipinx-enter-active,
	.flipinx-leave-active {
		animation-fill-mode: both;
	}
	.flipinx-enter-active {
		animation-duration: .4s;
		animation-name: flipinx-in;
		backface-visibility: visible;
	}
	.flipinx-leave-active {
		animation-duration: .4s;
		animation-name: flipinx-out;
	}

	@keyframes flipinx-in {
		50% {
			transform: scale(0);
		}

		100% {
			transform: scale(1);
		}

		/*flipInX*/
		/* from {
			transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
			animation-timing-function: ease-in;
			opacity: 0;
		}
		
		40% {
			transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
			animation-timing-function: ease-in;
		}
		
		60% {
			transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
			opacity: 1;
		}
		
		80% {
			transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
		}
		
		to {
			transform: perspective(400px);
		} */

		/*flipInY*/
		/* from {
		  -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
		  transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
		  -webkit-animation-timing-function: ease-in;
		  animation-timing-function: ease-in;
		  opacity: 0;
		}
		
		40% {
		  -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
		  transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
		  -webkit-animation-timing-function: ease-in;
		  animation-timing-function: ease-in;
		}
		
		60% {
		  -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
		  transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
		  opacity: 1;
		}
		
		80% {
		  -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
		  transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
		}
		
		to {
		  -webkit-transform: perspective(400px);
		  transform: perspective(400px);
		} */

		/*fadeInLeftBig*/
		/*from {
			opacity: 0;
			transform: translate3d(-2000px, 0, 0);
		}

		to {
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}*/
	}

	@keyframes flipinx-out {
		/* 0% {
			right: 0;
			transform: scale(1);
		}
		
		100% {
			right: -100%;
			transform: scale(0);
		} */


		/*bounceOutRight*/
		20% {
		  opacity: 1;
		  transform: translate3d(-20px, 0, 0);
		}

		to {
		  opacity: 0;
		  transform: translate3d(2000px, 0, 0);
		}

		/*fadeOutRightBig*/
		/* from {
		  opacity: 1;
		}
		
		to {
		  opacity: 0;
		  transform: translate3d(2000px, 0, 0);
		} */
	}

	.track-list {
		overflow-x: hidden;
		overflow-y: auto;
		scroll-behavior: smooth;
	}

	.total-search {
		color: #efff00;
	}

	.total-search span {
		color: #00b8ff;
		font-weight: bold;
	}

	.form-control.edit-playlist-input {
		background: transparent;
		border-bottom: 1px solid rgba(0, 255, 255, 0.33);
		height: 20px;
		padding: 0 2px;
		text-align: center;
	}
	.form-control.search-station-input {
		background: rgba(51, 51, 51, .5);
		border: 1px solid rgba(0, 255, 255, 0.33);
		border-radius: 4px;
		padding: 0 6px;
	}

	.form-control.edit-playlist-input,
	.form-control.search-station-input {
		color: #ccc;
		font-size: 14px;
		line-height: 1;
	}
	.form-control.edit-playlist-input:focus,
	.form-control.search-station-input:focus {
		background: transparent;
		color: #ccc;
	}
	.form-control.search-station-input:focus {
		box-shadow: 0 0 10px 0 #0ff inset;
		border: 1px solid #00afc5;
	}

	.no-results {
		/* cadetblue - #5f9ea0 */
		color: cadetblue; 
		font-size: 12px;
		right: 44px;
	}

	.search-station {
		margin-bottom: 8px;
	}

	.search-list {
		border-top: 1px solid #eee;
		overflow-x: hidden;
	}

	.resetSearch {
		right: 0;
	}

	.playlists {
		overflow-x: auto;
	}

	.playlist {
		align-items: center;
		border-radius: 1px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		height: 30px;
		width: 106px;
		min-width: 106px;
		margin-right: 6px;
		padding: 0;
		overflow: hidden;
		text-align: center;
		position: relative;
		transition: all 0.6s ease-out;
	}

	.playlist.active {
		box-shadow: inset 0 0 28px 2px rgba(128, 0, 255, 0.69);
		transition: all 0.6s ease-out 0.3s;
	}

	.playlist-controls {
		cursor: default;
		position: relative;
		z-index: 1;
	}

	.playlist-title {
		padding: 0 2px;
	}
</style>
