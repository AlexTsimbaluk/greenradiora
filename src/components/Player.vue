<template>
  <div class="hello">
	<h1>{{ msg }}</h1>

	<div>{{ station.station_title }}</div>
	
	<button @click="getAllStations">Get data</button>
	<button @click="clearLocalStorage">Clear LS</button>
	<!-- <button @click="displayStation">Display station</button> -->
  </div>
</template>

<script>
import $ from 'jquery';
import PlayerData from '@/PlayerData.js';

export default {
  name: 'Player',
  data () {
	return {
	  msg: 'Welcome to GreenRadioRa',
	  station: {},
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
  		console.log('Clear Local storage');
  		$('body').append('<div>Clear Local storage');
  	},
  	getAllStations () {
  		console.log('::Player.getAllStations');
  		// this.$emit('PlayerData.getAllStations')
  		PlayerData.getAllStations();
  	},
  	displayStation () {
  		this.station_title = this.stationsArray['2'].station_title;
  	}
  },
  created () {
  	// this.stationsArray = PlayerData.stationsArray;
  	// this.stationsArrayOn100 = PlayerData.stationsArrayOn100;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
