<template>
	<div class="player">
		<div
			v-if="xhrResponceRecieved"
		>
			<station
				:station="stationsArray[random]"
			></station>

			<div @click="togglePlaying">Play</div>

			<hr>
		</div>

		

		<button @click="clearLocalStorage">Clear LS</button>
		<button @click="locationReload">Reload</button>

		<audio id="playerTag" data-audio-api></audio>
	</div>
</template>

<script>
import Vue from 'vue';
import $ from 'jquery';

import PlayerData from '@/PlayerData.js';
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

			player: null,
			playing: false
		}
	},
	methods: {
		clearLocalStorage () {
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
		},
		dataTransfered () {
			Utils.logs('::Player:method:dataTransfered');

			this.stationsArray = JSON.parse(localStorage.getItem('stations'));
			this.makeOn100();
			this.random = this.stationKeys[Utils.getRandomInt(0, this.stTotal)];

			this.xhrResponceRecieved = true;
		},
		makeOn100 () {
			// массив имен станций
			// нужен для правильного получения stationsIndex
			// var this.stationKeys = [];
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
			console.log('Player::togglePlaying');
			this.player.src = this.stationsArray[this.random].station_url;
			if(!this.playing) {
				this.player.play();
				this.playing = !this.playing;
			} else {
				this.player.pause();
				this.playing = !this.playing;
			}
		}
	},
	created () {
		console.log('::Player:hook:created');

		PlayerData.$on('dataTransfer', () => {
			setTimeout(() => {
				Utils.logs('::Player:$on:dataTransfer');
				Utils.logs('::Data recieved');
				// PlayerData.createdInfo();
			}, 50);

			PlayerData.getAudioTag('playerTag');
			this.player = PlayerData.playerTag;
			console.log(this.player);

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
