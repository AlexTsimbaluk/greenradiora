<template>
	<div>
		<div
			v-if="xhrResponceRecieved"
		>
			<station
				:station="stationsArray['1111']"
			></station>
		</div>

		<button @click="clearLocalStorage">Clear LS</button>
	</div>
</template>

<script>
import Vue from 'vue';
import $ from 'jquery';
import PlayerData from '@/PlayerData.js';
import Station from '@/components/Station'

Vue.component('Station', Station);

export default {
	name: 'Player',
	data () {
		return {
			xhrResponceRecieved: false,
			stationsArray: {},
			stationsArrayOn100: []
		}
	},
	/*computed: {
	station_title: function () {
	return this.stationsArray['2'].station_title;
	}
	},*/
	methods: {
		clearLocalStorage () {
			localStorage.clear();
			console.log('::Player:method:clearLocalStorage');
			$('body').append('<div>Clear Local storage');
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
		// console.log(this.xhrRecieved());

		PlayerData.$on('dataTransfer', (all, on100) => {
			console.log('::Player:$on:dataTransfer');
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
