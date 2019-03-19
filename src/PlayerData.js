import Vue from 'vue';
import axios from 'axios';

import PlayerState from '@/PlayerState.js';

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
			// передача с отсрочкой, потому что Player не успевает создаться
			setTimeout(() => {
				// PlayerState.getAudioTag('playerTag');
				this.$emit('dataTransfer');
			}, msec);
		},
		init () {
			if(localStorage.getItem('stations') == undefined) {
				if(!this.cordovaReady) {
					this.getAllStations(this.apiUrl);
				}
			} else {
				this.xhrResponceRecieved = true;

				console.log('+++ PlayerData:$emit:dataTransfer:ls');
				this.dataTransfer(100);
			}
		},
		getAllStations (apiUrl) {
			let self = this;
			let xhrTimeout;
			let $app = document.getElementById('app');

			axios
				.get(apiUrl)
				.then((response) => {
					try {
						if(typeof response.data != 'object') {
							console.log('!!! запрос не вернул станции, а вернул вот это:');
							console.log(response.data);
							return;
						}

						if($app.classList.contains('error-ajax')) {
							$app.classList.remove('error-ajax');
						}

						console.log('');
						console.log('+++ Data from base received successfully and placed in ls');
						console.log('+++ PlayerData:$emit:dataTransfer:xhr');
						
						clearInterval(xhrTimeout);
						
						this.stationsArray = (response.data);

						for(let key in this.stationsArray) {
							let title = {
								original: this.stationsArray[key].station_title,
								translate: ''
							};

							let url = {
								original: this.stationsArray[key].station_url,
								translate: ''
							};

							this.stationsArray[key].station_title = title;
							this.stationsArray[key].station_url = url;
						}

						this.xhrResponceRecieved = true;
						localStorage.setItem('stations', JSON.stringify(this.stationsArray));

						this.dataTransfer(50);
					} catch(e) {
						console.log('!!! xhr:stop:fail::No response::Data from Database failed');
						console.log(e);
						throw new Error(e);
					}
				})
				.catch((error) => {
					console.log('!!! Error::не удалось создать ajax-запрос');
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
		console.log('@@@ PlayerData:hook:created');

		this.apiUrl = this.apiPrefix + this.apiAction;

		this.init();
	}
});
