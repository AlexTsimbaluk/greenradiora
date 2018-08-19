<template>
	<div>
		<div
			v-if="xhrResponceRecieved"
		>
			<station
				:station="stationsArray['1111']"
			></station>

			<hr>
		</div>
		
		<log></log>

		<button @click="clearLocalStorage">Clear LS</button>
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
			stationsArrayOn100: []
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
		xhrRecieved () {
			console.log(('::Player:method:xhrRecieved'));
			console.log(PlayerData.xhrResponceRecieved);
			return PlayerData.xhrResponceRecieved;
		},
		dataTransfered (all, on100) {
			console.log('::Player:method:dataTransfered');
			this.stationsArray = all;
			this.stationsArrayOn100 = on100;
			this.xhrResponceRecieved = true;
		}
	},
	created () {
		console.log('::Player:hook:created');

		PlayerData.$on('dataTransfer', (all, on100) => {
			setTimeout(() => {
				PlayerData.logs('::Player:$on:dataTransfer');
				PlayerData.logs('Data from local storage recieved');
				PlayerData.logs('hostname=' + window.location.hostname);
				PlayerData.logs('host=' + window.location.host);
				PlayerData.logs('hash=' + window.location.hash);
				PlayerData.logs('href=' + window.location.href);
				PlayerData.logs('origin=' + window.location.origin);
			}, 50);

			this.dataTransfered(all, on100);
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
