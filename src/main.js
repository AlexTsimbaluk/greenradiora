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
  template: '<App/>'
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