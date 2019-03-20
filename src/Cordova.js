import Vue from 'vue';

import PlayerData from '@/PlayerData.js';
import PlayerState from '@/PlayerState.js';

import Utils from '@/Utils.js';

export default new Vue({
	data () {
		return {
			device: 'unknown'
		}
	},
	methods: {
		
	},
	created () {
		Utils.logs('@@@ Cordova:hook:created');

		let $vm = this;

		let cordova = {
			initialize: function() {
				document.addEventListener('deviceready', () => {
					this.onDeviceReady();
				},
			false);
			},
			onDeviceReady: function () {
				Utils.logs('::Cordova::deviceready');
				// PlayerData.cordovaReady = true;

				let deviceInfo = 'Device Model: ' + device.model + '<br />' + 'Device Manufacturer: ' + device.manufacturer + '<br />' + 'Device Platform: ' + device.platform + '<br />' + 'Device Version: ' + device.version + '<br />' + 'Device Serial number: ' + device.serial + '<br />' + 'Device UUID: ' + device.uuid + '<br />' + 'Device Cordova: ' + device.cordova + '<br />';

				if (device.platform.toLowerCase().length) {
					this.device = device.platform.toLowerCase();
					Utils.logs(this.device);

					$vm.$emit('device', this.device);

					document.body.classList.add('device-' + this.device);
				}

				PlayerData.init();
			}
		};

		cordova.initialize();
	}
});