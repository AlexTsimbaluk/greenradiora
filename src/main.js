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
		console.log('::Cordova::deviceready');
		// PlayerData.cordovaReady = true;

		let deviceInfo = 'Device Model: ' + device.model + '<br />' + 'Device Manufacturer: ' + device.manufacturer + '<br />' + 'Device Platform: ' + device.platform + '<br />' + 'Device Version: ' + device.version + '<br />' + 'Device Serial number: ' + device.serial + '<br />' + 'Device UUID: ' + device.uuid + '<br />' + 'Device Cordova: ' + device.cordova + '<br />';
		// Utils.logs(device.platform);
		// Utils.logs('hostname=' + window.location.hostname);
		// Utils.logs('host=' + window.location.host);
		// Utils.logs('path=' + window.location.pathname);
		// Utils.logs('href=' + window.location.href);
		// Utils.logs('origin=' + window.location.origin);
		// Utils.logs(deviceInfo);

		if (device.platform.toLowerCase() == 'android') {
			
		} else if (device.platform.toLowerCase() == 'browser') {
			
		} else {
			
		}
		
		PlayerData.init();
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
		
	},
	created () {
		console.log('========Vue App Entry Point========');		
	}
});
