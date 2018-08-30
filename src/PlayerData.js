import Vue from 'vue';
import axios from 'axios';
import $ from 'jquery';
import Player from '@/components/Player';

export default new Vue({
	data: {
		// Массив со всеми станциями
		stationsArray: {},
		// префикс для url API для android на cordova
		apiPrefix: '',
		xhrResponceRecieved: false
	},
	methods: {
		getRandomInt (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		createdInfo () {
			this.logs('PlayerData.apiPrefix=' + this.apiPrefix);
			this.logs('host=' + window.location.host);
			this.logs('hostname=' + window.location.hostname);
			this.logs('pathname=' + window.location.pathname);
			this.logs('hash=' + window.location.hash);
			this.logs('href=' + window.location.href);
			this.logs('origin=' + window.location.origin);
		},
		logs (text) {
			this.$emit('log', text);
		},
		clearLocalStorage () {
			localStorage.clear();
			console.log('Clear Local storage');
			$('body').append('<div>Clear Local storage');
		},
		dataTransfer (msec) {
			console.log('dataTransfer');
			// передача с отсрочкой, потому что Player не успевает создаться
			setTimeout(() => {
				this.$emit('dataTransfer');
			}, msec);
		},
		getAllStations (urlApi) {
			console.log('::xhr:start');
			axios
				.post(
					urlApi,
					{
						actions: 'getAllStations'
					},
					{
						transformRequest: [
							function (data, headers) {
								let formdata = new FormData();
								formdata.append('action', 'getAllStations');
								return formdata;
							}
						]
					}
				)
				.then((response) => {
					try {
						console.log('::xhr:stop:succecc');
						this.stationsArray = (response.data);

						this.xhrResponceRecieved = true;
						localStorage.setItem('stations', JSON.stringify(this.stationsArray));

						console.log('::PlayerData:$emit:dataTransfer:xhr');
						this.dataTransfer(50);

						this.logs('::Data from Database success and placed in localstorage');

						// location.reload();
					} catch(e) {
						console.log('::xhr:stop:fail');
						console.log('Error::No response');
						throw new Error(e);
						this.logs('::Data from Database failed');
					}
				})
				.catch((error) => {
					console.log('Error::не удалось создать ajax-запрос');
					this.logs('::Ajax failed');
					// TODO: переделать на добавление класса объекту Vue
					// $('#app').addClass('js-error error-ajax-query');
					console.log(error)
				});
		}
	},
	created () {
		console.log('::PlayerData:hook:created');
		console.log('::PlayerData:method:getAllStations');

		if(localStorage.getItem('stations') == undefined) {
			console.log('::Need ajax for allStations list');
			this.logs('::Data from local storage is empty, need ajax for data list');

			let urlApi = this.apiPrefix + '/actions.php';
			
			console.log('hostname=' + window.location.hostname);
			console.log('host=' + window.location.host);
			console.log('hash=' + window.location.hash);
			console.log('href=' + window.location.href);
			console.log('origin=' + window.location.origin);
			console.log('urlApi=' + urlApi);

			setTimeout(() => {
				this.logs(urlApi);
			}, 50);

			this.getAllStations(this.apiPrefix + '/actions.php');
		} else {
			console.log('::PlayerData:Get stations from Local storage');
			this.stationsArray 		= JSON.parse(localStorage.getItem('stations'));
			this.xhrResponceRecieved = true;

			console.log('::PlayerData:$emit:dataTransfer:ls');
			this.dataTransfer(100);
		}		
	}
});
