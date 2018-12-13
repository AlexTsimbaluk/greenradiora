import Vue from 'vue';
import router from './router';

import PlayerData from '@/PlayerData.js';
import PlayerState from '@/PlayerState.js';

import Utils from '@/Utils.js';
// import P_Config from '@/P_Config.js';

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
		// PlayerData.cordovaReady = true;

		let path = window.location.pathname;
		console.log(path);


		if (device.platform.toLowerCase() == 'android') {
			PlayerData.apiPrefix = 'http://greenradiora.ru';
			// PlayerData.apiPrefix = path.substring(0, path.lastIndexOf('/'));
		} else if (device.platform.toLowerCase() == 'browser') {
			PlayerData.apiPrefix = 'http://greenra/api';
			// PlayerData.apiPrefix = path.substring(0, path.lastIndexOf('/'));
		} else {
			// PlayerData.apiPrefix = '';
		}
		PlayerData.getAllStations(PlayerData.apiPrefix + '/actions.php');

		// let deviceInfo = 'Device Model: ' + device.model + '<br />' + 'Device Manufacturer: ' + device.manufacturer + '<br />' + 'Device Platform: ' + device.platform + '<br />' + 'Device Version: ' + device.version + '<br />' + 'Device Serial number: ' + device.serial + '<br />' + 'Device UUID: ' + device.uuid + '<br />' + 'Device Cordova: ' + device.cordova + '<br />';
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
