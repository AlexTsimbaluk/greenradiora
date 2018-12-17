import Vue from 'vue';
import $ from 'jquery';

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
		let path = window.location.pathname;
		
		console.log(path);
		console.log(deviceInfo);
		console.log(device.platform);

		Utils.logs('hostname=' + window.location.hostname);
		Utils.logs('host=' + window.location.host);
		Utils.logs('path=' + window.location.pathname);
		Utils.logs('href=' + window.location.href);
		Utils.logs('origin=' + window.location.origin);
		console.log();
		// Utils.logs(deviceInfo);

		$('#android-test').html(location.href);


		if (device.platform.toLowerCase() == 'android') {
			PlayerData.apiPrefix = 'http://vuea.radiora.ru';
			
			if(location.pathname.indexOf('index.html') != -1) {
				// location.replace(location.origin);
			}

			// PlayerData.apiPrefix = path.substring(0, path.lastIndexOf('/'));
		} else if (device.platform.toLowerCase() == 'browser') {
			PlayerData.apiPrefix = 'http://vuea.radiora.ru';
			// PlayerData.apiPrefix = path.substring(0, path.lastIndexOf('/'));
		} else {
			PlayerData.apiPrefix = '';
		}
		
		// PlayerData.getAllStations(PlayerData.apiPrefix + '/api/actions.php?action=getAllStations');
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

		Utils.logs('hostname=' + window.location.hostname);
		Utils.logs('host=' + window.location.host);
		Utils.logs('path=' + window.location.pathname);
		Utils.logs('href=' + window.location.href);
		Utils.logs('origin=' + window.location.origin);

		/*var cordova = {
			initialize: function() {
				document.addEventListener('deviceready', () => {
					this.onDeviceReady();
				},
			false);
			},
			onDeviceReady: function () {
				console.log('::Cordova:event::deviceready');
				// PlayerData.cordovaReady = true;

				let deviceInfo = 'Device Model: ' + device.model + '<br />' + 'Device Manufacturer: ' + device.manufacturer + '<br />' + 'Device Platform: ' + device.platform + '<br />' + 'Device Version: ' + device.version + '<br />' + 'Device Serial number: ' + device.serial + '<br />' + 'Device UUID: ' + device.uuid + '<br />' + 'Device Cordova: ' + device.cordova + '<br />';
				let path = window.location.pathname;
				
				console.log(path);
				console.log(deviceInfo);
				console.log(device.platform);


				if (device.platform.toLowerCase() == 'android') {
					PlayerData.apiPrefix = 'http://vuea.radiora.ru';
					// PlayerData.apiPrefix = path.substring(0, path.lastIndexOf('/'));
				} else if (device.platform.toLowerCase() == 'browser') {
					PlayerData.apiPrefix = 'http://vuea.radiora.ru';
					// PlayerData.apiPrefix = path.substring(0, path.lastIndexOf('/'));
				} else {
					// PlayerData.apiPrefix = '';
				}
				// PlayerData.getAllStations(PlayerData.apiPrefix + '/api/actions.php?action=getAllStations');
				// PlayerData.init();

				// return;
				
				PlayerData.init();
			}
		};

		cordova.initialize();*/

		// console.log(cordova);

		// if(!cordova) {
			// PlayerData.init();
		// }
	}
});
