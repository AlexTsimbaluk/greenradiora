/* eslint-disable */
import $ from 'jquery';
import Vue from 'vue';
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

console.log($('h1'));
