<template>
  <div class="hello">
	<div>{{ station }}</div>
	
	<button @click="clearLocalStorage">Clear LS</button>
  </div>
</template>

<script>
import $ from 'jquery';
import PlayerData from '@/PlayerData.js';

export default {
  name: 'Player',
  data () {
	return {
	  station: '',
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
	    setTimeout(() => {
	    	location.reload();
	    }, 1000);
	}
  },
  created () {
  	this.stationsArray = PlayerData.stationsArray;
  	this.stationsArrayOn100 = PlayerData.stationsArrayOn100;
	this.station = this.stationsArray['111'].station_title;
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
