import Vue from 'vue';
import $ from 'jquery';
import axios from 'axios';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

var cordova = {
    initialize: function() {
        document.addEventListener('deviceready', () => {
			console.log('::Cordova event::deviceready');
		}, false);
    }
};

cordova.initialize();

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
  	// Массив со всеми станциями
  	stationsArray: {},

  	// Массив со всеми станциями, только станции сгруппированы в массивы по 100шт
  	stationsArrayOn100: [],
  },
  methods: {
  	cordovaUrl (url) {
  		console.log(device);
  		var path = window.location.pathname;

  		if (device.platform.toLowerCase() == 'android') {
  		    // url = '/platforms/android/app/src/main/assets/www' + url;
  		} else if (device.platform.toLowerCase() == 'browser') {
  		    url = path.substring(0, path.lastIndexOf('/')) + url;
  		}
			console.log(url);
			return url;
  	}
  },
  created () {
  	if(localStorage.getItem('stations') == undefined) {
  		console.log('::Need ajax for allStations list');
	    
	    let formdata = new FormData();
	    formdata.append('action', 'getAllStations');

	    axios
      .post('/api/actions.php', formdata)
      .then((response) => {
      	try {
      		this.stationsArray = (response);
      		var size 		= 0;
      		for (var key in this.stationsArray) {
      			size++;
      		}
      		var totalArrays = Math.ceil(size / 100);

      		// массив имен станций
      		// нужен для правильного получения stationsIndex
      		var keys = [];

      		for(var key in this.stationsArray) {
      			keys.push(key);
      		}

      		for (var i = 0; i < totalArrays; i++) {
      			this.stationsArrayOn100[i] = [];  // TODO здесь баги
      			for (var j = 0; j < 100; j++) {
      				var stationsIndex = keys[i * 100 + j];
      				// если последняя станция - break
      				// почему?
      				// return?
      				if(i == totalArrays - 1 && j == size % 100) {
      					break;
      				}
      				// TODO
      				//  сделать проверку что this.stationsArray[stationsIndex] не null
      				this.stationsArrayOn100[i][j] = this.stationsArray[stationsIndex];
      			}
      		}

      		localStorage.setItem('stations', JSON.stringify(this.stationsArray));
      		localStorage.setItem('stationsOn100', JSON.stringify(this.stationsArrayOn100));

      		// location.reload();
      	} catch(e) {
      		$('body').addClass('error-mysql-connect');
      		throw new Error(e + ':' + response);
      	}
      })
      .catch((error) => {
      	console.log(error)
      });
    } else {
    	console.log('::Get stations from Local storage');
    	this.stationsArray 		= JSON.parse(localStorage.getItem('stations'));
    	this.stationsArrayOn100 	= JSON.parse(localStorage.getItem('stationsOn100'));
    }
  }
});



/*$.ajaxSetup({
	type: 'POST',
	url: './assets/api/actions.php',
	complete: function() {},
	statusCode: {
		200: function(message) {},
		403: function(jqXHR) {
			'use strict';
			var error = JSON.parse(jqXHR.responseText);
			$("body").prepend(error.message);
		}
	},
	error: function (error, xhr, status, errorThrown) {
		'use strict';
		console.log('XHR error');
		console.log(error);
	}
});

$.ajax({
	// data: {'action': 'getAllStations'},
	success: function(data) {
		console.log(data);
	}
});	*/