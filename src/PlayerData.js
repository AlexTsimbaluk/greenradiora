import Vue from 'vue';
import axios from 'axios';

export default new Vue({
	data: {
		// инициализировалась ли cordova
		cordovaReady: false,
		device: '',
		// Массив со всеми станциями
		stationsArray: {},
		apiPrefix: 'http://vuea.radiora.ru',
		apiAction: '/api/actions.php?action=getAllStations',
		apiUrl: '',
		xhrResponceRecieved: false
	},
	methods: {
		dataTransfer (msec) {
			console.log('dataTransfer');
			// передача с отсрочкой, потому что Player не успевает создаться
			setTimeout(() => {
				this.$emit('dataTransfer');
			}, msec);
		},
		init () {
			if(localStorage.getItem('stations') == undefined) {
				console.log('::Data from local storage is empty, need ajax for Stations list');

				if(!this.cordovaReady) {
					this.getAllStations(this.apiUrl);
				}
			} else {
				console.log('::PlayerData:Get stations from Local storage');
				// this.stationsArray 		= JSON.parse(localStorage.getItem('stations'));
				this.xhrResponceRecieved = true;

				console.log('::PlayerData:$emit:dataTransfer:ls');
				this.dataTransfer(100);
			}
		},
		getAllStations (apiUrl) {
			console.log('PlayerData::getAllStations:start');
			let self = this;
			let xhrTimeout;
			let $app = document.getElementById('app');

			axios
				.get(apiUrl)
				.then((response) => {
					try {
						console.log('::xhr:stop:succecc');

						if(typeof response.data != 'object') {
							console.log('запрос не вернул станции, а вернул вот это:');
							console.log(response.data);
							return;
						}

						if($app.classList.contains('error-ajax')) {
							$app.classList.remove('error-ajax');
						}

						clearInterval(xhrTimeout);
						
						this.stationsArray = (response.data);
						this.xhrResponceRecieved = true;

						localStorage.setItem('stations', JSON.stringify(this.stationsArray));

						console.log('::PlayerData:$emit:dataTransfer:xhr');
						this.dataTransfer(50);

						console.log('::Data from Database success and placed in localstorage');
					} catch(e) {
						console.log('::xhr:stop:fail');
						console.log('Error::No response');
						throw new Error(e);
						console.log('::Data from Database failed');
					}
				})
				.catch((error) => {
					console.log('Error::не удалось создать ajax-запрос');
					console.log(error);
					console.log(error.message);

					if(!$app.classList.contains('error-ajax')) {
						$app.classList.add('error-ajax');
					}

					if(Object.keys(self.stationsArray).length  == 0) {
						xhrTimeout = setTimeout(() => {
							console.log('xhr::timeout');
							self.getAllStations(this.apiUrl);
						}, 1000);
					}
				})
				.then(function () {
					
				});
		}
	},
	created () {
		console.log('::PlayerData:hook:created');

		this.apiUrl = this.apiPrefix + this.apiAction;

		this.init();
	}
});
