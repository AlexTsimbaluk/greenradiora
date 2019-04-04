<template>
	<div
		class="player flex-grow mx-auto"
	>
		<loader v-if="!xhrResponceRecieved || waiting"></loader>

		<transition
			mode="out-in"
			enter-active-class="animated fadeIn"
		    leave-active-class="animated fadeOut"
		>
			<div
				v-if="xhrResponceRecieved"
				class="d-flex flex-column h-100"
			>
				<!-- track title, playing time -->
				<div
					class="d-flex flex-shrink-0 justify-content-between current-track px-2"
				>
					<transition name="flip" mode="out-in">
						<!-- <div
							v-if="!state.paused && state.nowPlaying.track"
							class="flex-grow-1 track-title"
						>
							{{state.nowPlaying.track.station_title.original}}
						</div> -->

						<div
							class="flex-grow-1 position-relative o-x-hidden"
						>
							<div
								v-if="!state.paused && state.streamInfo"
								class="track-title running-string"
							>
								{{state.streamInfo}}
							</div>
						</div>
					</transition>

					<transition name="flip" mode="out-in">
						<div
							v-if="!state.paused"
							class="d-flex align-items-center time ml-2"
						>
							{{playingTime}}
						</div>
					</transition>
				</div>
				
				<!-- search station input, status -->
				<div class="d-flex flex-shrink-0 row no-gutters py-2 position-relative px-2">
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
					
					<transition name="flip" mode="out-in">
						<div
							@click="state.status = ''"
							v-if="state.status"
							class="status"
						>
							{{state.status}}
						</div>
					</transition>
				</div>

				<!-- user panel with contols -->
				<user-panel
					:state="state"
				></user-panel>
				
				<!-- buttons, volume -->
				<div class="d-flex flex-wrap flex-shrink-0 justify-content-between py-2 pb-2 px-2">
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

				<!-- playlists Panel -->
				<div class="d-flex align-items-center flex-shrink-0 pb-2 pl-2 position-relative">
					<div
						ref="playlistsPanel"
						v-scroll="getScroll"
						class="d-flex flex-grow-1 playlists"
					>
						<transition
							mode="out-in"
							enter-active-class="animated zoomIn faster"
						    leave-active-class="animated rotateOutDownLeft faster"
						>
							<div
								class="playlist playlist-name-error"
								v-if="state.playlistNameError != -1 && playlistEdit != -1"
								:style="{ left: state.playlistNameError * 106 + 'px' }"
							>
								No, please
								<!-- <m-icon
									class="ml-1"
									:i="'sentiment_dissatisfied'"
									:t="'light'"
									:s="'16'"
								></m-icon> -->
								<span class="font-size-15">☹</span>
								<!-- <span class="font-size-24" style="margin-top: -4px;">☺</span> -->
							</div>
						</transition>

						<!-- <transition-group
							mode="out-in"
							enter-active-class="animated zoomIn faster"
						    leave-active-class="animated rotateOutDownLeft faster"						    
							class="d-flex w-100 o-y-hidden"
						> -->
							<div class="d-flex">
								<div
									v-for="(playlist, index) in state.playlistsOrder"
									class="playlist"
									:class="[playlist == state.currentPlaylist ? 'active' : '']"
									:key="index"
								>							
									<div class="row flex-nowrap w-100 h-100 no-gutters position-relative">
										<div
											:class="[playlist == state.currentPlaylist ? 'd-flex' : 'hidden']"
											class="col justify-content-center playlist-controls"
											@click.stop="deletePlaylist(playlist, index, playlist == state.currentPlaylist)"
										>
											<m-icon
												:i="'not_interested'"
												:t="'light'"
												:s="'16'"
											></m-icon>
										</div>

										<div
											:class="[playlist == state.currentPlaylist ? '_col-14' : 'col px-2']"
											class="d-flex position-static font-size-13 plt"
										>
											<transition
												mode="out-in"
												enter-active-class="animated zoomIn fastest"
											    leave-active-class="animated zoomOut fastest"
											>
												<div
													v-if="playlistEdit != index"
													key="name"
													@click="setCurrentPlaylist($event, playlist)"
													class="align-self-center w-100 o-x-hidden text-ellipsis playlist-title"
												>
													{{playlist}}
													<ripple></ripple>
												</div>

												<div
													v-if="playlistEdit == index"
													key="edit"
													class="align-self-center playlist-title"
												>
														<!-- v-model="state.playlistsOrder[index]" -->
														<!-- @change="playlistNameUpdated($event, playlist, index)" -->
														<!-- @keyup.enter="toggleEditPlaylist(playlist, -1, playlist == state.currentPlaylist)" -->
													<input
														v-focus
														:value="state.playlistsOrder[index]"
														@keyup="setPlaylistName($event, playlist, index)"
														type="text"
														placeholder="Edit"
														class="form-control edit-playlist-input"
													/>
												</div>
											</transition>
										</div>

										<div
											:class="[playlist == state.currentPlaylist ? 'd-flex' : 'hidden']"
											class="col justify-content-center playlist-controls"
											@click.stop="toggleEditPlaylist(playlist, index, playlist == state.currentPlaylist)"
										>
											<m-icon
												:i="'edit'"
												:t="'light'"
												:s="'16'"
											></m-icon>
										</div>
									</div>
								</div>
							</div>
						<!-- </transition-group> -->
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
				
				<!-- track list -->
				<div
					class="d-flex flex-column flex-grow-1 no-gutters track-list-container pb-3"
				>
					<!-- playlist's tracks -->
					<transition name="slide" mode="out-in">
						<div
							v-if="!searchFull"
							class="col pb-2 track-list"
						>
							<transition-group
								v-if="state.currentPlaylist && state.playlists[state.currentPlaylist] && state.playlists[state.currentPlaylist].tracks.length"
								mode="out-in"
								enter-active-class="animated fadeInLeft slow-fast"
							    leave-active-class="animated fadeOutRight faster"
							>
								<station
									v-for="(track, key) in state.playlists[state.currentPlaylist].tracks"
									:station="stationsArray[track]"
									:translated="state.translated"
									:key="track"
									:class="{playing: state.nowPlaying.track && state.nowPlaying.track.station_id == track}"
								></station>
							</transition-group>
						</div>
					</transition>

					<!-- search -->
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
		</transition>
	</div>
</template>

<script>
import Vue from 'vue';

import PlayerData from '@/PlayerData.js';
import PlayerState from '@/PlayerState.js';
import PlayerAudio from '@/PlayerAudio.js';
import P_Config from '@/P_Config.js';
import Utils from '@/Utils.js';

import Log from '@/components/Log';
import Station from '@/components/Station';
import UserPanel from '@/components/UserPanel';



Vue.component('Station', Station);
Vue.component('UserPanel', UserPanel);


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

			playerTag: null,

			state: {},

			searchString: '',
			searchResults: [],
			noSearchResults: false,
			searchFull: false,

			playlistEdit: -1,
			playlistEditedIsActive: null
		}
	},
	methods: {
		init (reinit) {
			this.stationsArray = JSON.parse(localStorage.getItem('stations'));

			if(reinit) return false;

			Utils.logs('+++ Player:init successfully');
			console.log('make100');
			this.makeOn100();
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
		setCurrentPlaylist (event, playlist) {
			// console.log(event.clientX);
			// console.log(event.pageX);
			// console.log(event.screenX);
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

					let val = _st[_p].original.toLowerCase();

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
			let $playlistsPanel = this.$refs.playlistsPanel;

			PlayerState.addPlaylist();
			// $playlistsPanel.scrollLeft = $playlistsPanel.scrollWidth;
			$playlistsPanel.scrollTo({top: 0, left: $playlistsPanel.scrollWidth, behavior: 'smooth'});
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
			this.state.playlistNameError = -1;

			if(index == -1 || (this.playlistEdit == index)) {
				this.playlistEdit = -1;
			} else if(this.playlistEdit != index) {
				this.playlistEdit = index;
			}

			this.playlistEditedIsActive = active;
			PlayerState.stateChanged();
		},
		setPlaylistName (event, playlist, index) {
			let val = event.target.value;

			if(val.length == 0 || val == playlist) {
				return false;
			}

			let duplicate = Object.keys(this.state.playlists).some((name) => {
				return name == val;
			});

			if(duplicate) {
				this.state.playlistNameError = index;
				return false;
			}


			// TODO: починить на телефоне
			if(val.length == 0 || duplicate) {
				// this.state.playlistNameError = index;
				// ☯ - 9775
				// ☺ - 9786
				// let nbsp = String.fromCharCode(9775) + String.fromCharCode(160);
			} else {
				// this.state.playlistNameError = -1;
			}

			if(val.length > 0 && !duplicate) {
				this.state.playlistNameError = -1;
				PlayerState.editPlaylist(playlist, val, index, this.playlistEditedIsActive);
			}
		},
		getScroll (event, el) {
			console.log(event);
			console.log(el);
		}
	},
	created () {
		console.log('@@@ Player:hook:created');

		PlayerData.$on('dataTransfer', () => {
			Utils.logs('');
			console.log('+++ Player:$on:dataTransfer::Data from PlayerData recieved successfully');

			PlayerState.getAudioTag('playerTag');
			this.playerTag = PlayerState.playerTag;

			PlayerState.playerTag.addEventListener('timeupdate', (e)=> {
				var time = Math.ceil(PlayerState.playerTag.currentTime);

				var sec = ('0' + parseInt(Math.floor(time % 60))).slice(-2);
				var min = ('0' + parseInt((Math.floor(time / 60)) % 60)).slice(-2);

				this.playingTime = min + ':' + sec;
			});

			this.init(false);

			this.state = PlayerState.playerState;
			this.state.status = '';
		});

		PlayerState.$on('stateChanged', (state) => {
			this.state = state;
		});

		PlayerState.$on('stationsChanged', () => {
			this.init(true);
		});

		PlayerState.$on('loader', (visible) => {
			// console.log('::Player:$on:PlayerState:loader');
			this.waiting = visible;
		});
	}
}
</script>

<style>
	.current-track {
		font-size: 14px;
		height: 24px;
		overflow-y: hidden;
	}

	.status {
		cursor: default;
		font-size: 12px;
		line-height: 1;
		position: absolute;
		top: 8px;
		right: 0;
	}

	.device-android .status {
		top: 12px;
		right: 14px;
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

	.track-title.running-string {
		animation: running-string linear infinite 30s;
		position: absolute;
		width: max-content;
	}
	@keyframes running-string {
		0% {
			left: 105%;
			transform: translateX(0);
		}
		50% {
			left: -5%;
			transform: translateX(-100%);
		}
		100% {
			left: 105%;
			transform: translateX(0);
		}
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
		scroll-behavior: smooth;
	}

	.playlist {
		align-items: center;
		border-radius: 1px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		height: 32px;
		line-height: 32px;
		width: 106px;
		min-width: 106px;
		/*margin-right: 6px;*/
		padding: 0;
		overflow: hidden;
		text-align: center;
		position: relative;
		transition: all 0.6s ease-out;
	}

	.device-android .playlist {
		width: 100px;
		min-width: 100px;
	}

	.playlist .material-icons {
		line-height: 32px;
	}

	.playlist.active {
		box-shadow: inset 0 0 28px 2px rgba(128, 0, 255, 0.69);
		transition: all 0.6s ease-out 0.3s;
	}

	.playlist-controls {
		/* flex-grow: 1;
		flex-grow: 0;
		flex-shrink: 1;
		flex-shrink: 0;
		flex: 0 1 20%;*/

		cursor: default;
		padding: 0 2px;
		position: relative;
		z-index: 1;
	}

	.plt {
		/* flex-grow: 1;
		flex-grow: 0;
		flex-shrink: 1;
		flex-shrink: 0; */
		/*flex: 0 1 60%;*/
	}

	.playlist-title {
		padding: 0 2px;
	}

	.playlist-name-error {
		font-size: 13px;
		margin-left: 10px;
		margin-right: 0;
		top: -20px;
		position: absolute;
	}
</style>
