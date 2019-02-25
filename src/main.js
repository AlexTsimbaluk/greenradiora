import Vue from 'vue';

import router from './router';

import PlayerData from '@/PlayerData.js';

import Utils from '@/Utils.js';

import App from './App';

Vue.config.productionTip = false;



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
		console.log('');
		console.log('========Vue App Entry Point========');

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

				if (device.platform.toLowerCase() == 'android') {
					PlayerData.device = 'android';

				} else if (device.platform.toLowerCase() == 'browser') {
					PlayerData.device = 'browser';
				} else {
					PlayerData.device = 'unknown';
				}

				document.body.classList.add('device-' + PlayerData.device);
				
				PlayerData.init();

				this.$emit('deviceready')
			}
		};

		cordova.initialize();
	}
});
