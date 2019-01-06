<template>
	<div class="player">
		<loader v-if="!xhrResponceRecieved || waiting"></loader>

		<div
			v-if="xhrResponceRecieved"
		>
			<button
				class="btn btn-outline-info btn-fab btn-round"
				@click="getRandomStation"
			>
				<m-icon
					class="md-24"
					:i="'call_split'"
					:t="'light'"
				></m-icon>
				<!-- {{random}} -->
				<ripple></ripple>
			</button>

			<button
				class="btn btn-outline-info btn-fab btn-round"
				@click="togglePlaying"
			>
				<m-icon
					class="md-24"
					:i="'play_arrow'"
					:t="'light'"
				></m-icon>
				<ripple></ripple>
			</button>

			<div
				v-if="state.status == 'playing' || state.status == 'canplaythrough'"
				class="time"
			>
				{{playingTime}}
			</div>

			<div>
				{{state.status}}
			</div>

			<div class="playlists d-flex">
				<div
					@click="setCurrentPlaylist(playlist)"
					v-for="playlist in state.playlistsOrder"
					class="playlist"
				>
					{{playlist}}
				</div>
			</div>

			<div
				class="track-list"
			>
				<station
					v-for="(track, key) in state.playlists[state.currentPlaylist].tracks"
					:station="stationsArray[track]"
					:key="track.station_id"
				></station>
			</div>

			<hr>
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
			random: null,

			getRandomInt: Utils.getRandomInt,

			playing: false,
			playingTime: null,

			waiting: false,

			state: {}
		}
	},
	methods: {
		getRandomStation () {
			this.random = this.stationKeys[this.getRandomInt(0, this.stTotal)];
			// Utils.logs(this.random);
		},
		dataTransfered () {
			Utils.logs('::Player:method:dataTransfered');

			this.stationsArray = JSON.parse(localStorage.getItem('stations'));
			this.makeOn100();
			this.random = this.stationKeys[this.getRandomInt(0, this.stTotal)];

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
		togglePlaying () {
			console.log(this.state.playlists[this.state.currentPlaylist].tracks);
			if(PlayerState.paused) {
				console.log('Player::Play');
				PlayerState.playStream(this.stationsArray[this.random].station_url);
			} else {
				console.log('Player::Stop');
				PlayerState.stopStream();
			}
		},
		setCurrentPlaylist (playlist) {
			PlayerState.setCurrentPlaylist(playlist);
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
		});

		PlayerState.$on('stateChanged', (state) => {
			// console.log('::Player:$on:PlayerState:stateChanged');
			// console.log(state);

			this.state = state;
			console.log(this.state.status);
		});

		PlayerState.$on('loader', (visible) => {
			console.log('::Player:$on:PlayerState:loader');
			
			this.waiting = visible;
		});
	}
}
</script>

<style>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.playlists {
	padding: 2px 0;
}

.playlist {
	border-radius: 1px;
	cursor: pointer;
	padding: 0 4px;
	text-align: center;
	overflow: hidden;
	width: 80px;
}
</style>
