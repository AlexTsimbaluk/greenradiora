<template>
	<div>
		<div
			v-if="xhrResponceRecieved"
		>
			<station
				:station="stationsArray[random]"
			></station>

			<hr>
		</div>

		<log></log>

		<button @click="clearLocalStorage">Clear LS</button>
		<button @click="locationReload">Reload</button>
	</div>
</template>

<script>
import Vue from 'vue';
import $ from 'jquery';

import PlayerData from '@/PlayerData.js';

import Log from '@/components/Log'
import Station from '@/components/Station'

Vue.component('Log', Log);
Vue.component('Station', Station);

export default {
	name: 'Player',
	data () {
		return {
			logs: [],
			xhrResponceRecieved: false,
			stationsArray: {},
			stationsArrayOn100: [],
			stationKeys: [],
			stTotal: 0,
			random: null
		}
	},
	methods: {
		clearLocalStorage () {
			localStorage.clear();
			console.log('::Player:method:clearLocalStorage');
			PlayerData.logs('::Clear Local storage');
			setTimeout(() => {
				location.reload();
			}, 1000);
		},
		locationReload () {
			localStorage.clear();
			console.log('::Player:method:locationReload');
			setTimeout(() => {
				location.reload();
			}, 100);
		},
		dataTransfered () {
			PlayerData.logs('::Player:method:dataTransfered');
			this.stationsArray = JSON.parse(localStorage.getItem('stations'));
			this.makeOn100();
			this.random = this.stationKeys[PlayerData.getRandomInt(0, this.stTotal)];

			this.xhrResponceRecieved = true;

			console.log(this.stationsArray['2'].station_url);
			PlayerData.logs(this.stationsArray['2'].station_url);
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
		}
	},
	created () {
		console.log('::Player:hook:created');

		PlayerData.$on('dataTransfer', () => {
			setTimeout(() => {
				PlayerData.logs('::Player:$on:dataTransfer');
				PlayerData.logs('::Data recieved');
				// PlayerData.createdInfo();
			}, 50);

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
