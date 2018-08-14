import Vue from 'vue';
import router from './router';

import $ from 'jquery';
import App from './App';

Vue.config.productionTip = false;

var cordova = {
	initialize: function() {
		document.addEventListener('deviceready', () => {
		this.onDeviceReady();
	}, false);
	},
	onDeviceReady: function () {
		console.log('::Cordova event::deviceready');

		let deviceInfo = 'Device Model: ' + device.model + '<br />' + 'Device Manufacturer: ' + device.manufacturer + '<br />' + 'Device Platform: ' + device.platform + '<br />' + 'Device Version: ' + device.version + '<br />' + 'Device Serial number: ' + device.serial + '<br />' + 'Device UUID: ' + device.uuid + '<br />' + 'Device Cordova: ' + device.cordova + '<br />';
		// console.log(deviceInfo);
	}
};

cordova.initialize();

new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>',
	data: {
		
	}
});
