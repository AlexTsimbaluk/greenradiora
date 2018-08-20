import Vue from 'vue';
import router from './router';

import $ from 'jquery';
import PlayerData from '@/PlayerData.js';
import App from './App';

Vue.config.productionTip = false;

var cordova = {
	initialize: function() {
		document.addEventListener('deviceready', () => {
			this.onDeviceReady();
		},
	false);
	},
	onDeviceReady: function () {
		console.log('::Cordova:event::deviceready');

		let path = window.location.pathname;
		console.log(path);

		PlayerData.apiPrefix = 'http://greenra';
		
		if (device.platform.toLowerCase() == 'android') {
			// PlayerData.apiPrefix = path.substring(0, path.lastIndexOf('/'));
		} else if (device.platform.toLowerCase() == 'browser') {
			// PlayerData.apiPrefix = path.substring(0, path.lastIndexOf('/'));
		} else {
			// PlayerData.apiPrefix = '';
		}
		PlayerData.getAllStations(PlayerData.apiPrefix + '/api/actions.php');

		PlayerData.logs('PlayerData.apiPrefix=' + PlayerData.apiPrefix);
		PlayerData.logs('host=' + window.location.host);
		PlayerData.logs('hostname=' + window.location.hostname);
		PlayerData.logs('pathname=' + window.location.pathname);
		PlayerData.logs('hash=' + window.location.hash);
		PlayerData.logs('href=' + window.location.href);
		PlayerData.logs('origin=' + window.location.origin);

		let deviceInfo = 'Device Model: ' + device.model + '<br />' + 'Device Manufacturer: ' + device.manufacturer + '<br />' + 'Device Platform: ' + device.platform + '<br />' + 'Device Version: ' + device.version + '<br />' + 'Device Serial number: ' + device.serial + '<br />' + 'Device UUID: ' + device.uuid + '<br />' + 'Device Cordova: ' + device.cordova + '<br />';
	}
};

cordova.initialize();

new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>',
	data: {
		
	}
});
