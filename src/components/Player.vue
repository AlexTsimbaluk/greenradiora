<template>
	<div class="player">
		<div
			v-if="xhrResponceRecieved"
		>
			<station
				:station="stationsArray[random]"
			></station>

			<hr>
		</div>

		

		<button
			class="btn btn-primary"
			@click="clearLocalStorage"
		>
			Clear LS
			<ripple></ripple>
		</button>

		<button
			class="btn btn-primary"
			@click="locationReload"
		>
			Reload
			<ripple></ripple>
		</button>

		<button
			class="btn btn-primary"
			@click="getRandomStation"
		>
			Random
			{{random}}
			<ripple></ripple>
		</button>

		<button
			class="btn btn-primary"
			@click="togglePlaying"
		>
			Play
			<ripple></ripple>
		</button>

		<audio id="playerTag"></audio>
	</div>
</template>

<script>
import Vue from 'vue';

import PlayerData from '@/PlayerData.js';
import PlayerState from '@/PlayerState.js';
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
			locationReload: Utils.locationReload,
			clearLocalStorage: Utils.clearLocalStorage,

			player: null,
			playing: false
		}
	},
	methods: {
		getRandomStation () {
			this.random = this.stationKeys[this.getRandomInt(0, this.stTotal)];
		},
		/*clearLocalStorage () {
			localStorage.clear();
			console.log('::Player:method:clearLocalStorage');
			Utils.logs('::Clear Local storage');
			setTimeout(() => {
				location.reload();
			}, 1000);
		},
		locationReload () {
			console.log('::Player:method:locationReload');
			setTimeout(() => {
				location.reload();
			}, 100);
		},*/
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
		togglePlaying() {
			if(PlayerState.paused) {
				console.log('Player::Play');
				PlayerState.playStream(this.stationsArray[this.random].station_url);
			} else {
				console.log('Player::Stop');
				PlayerState.stopStream();
			}
		}
	},
	created () {
		console.log('::Player:hook:created');

		PlayerData.$on('dataTransfer', () => {
			Utils.logs('::Player:$on:dataTransfer');
			Utils.logs('::Data recieved');

			PlayerState.getAudioTag('playerTag');

			this.dataTransfered();
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
</style>
