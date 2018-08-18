import Vue from 'vue';
import axios from 'axios';
import $ from 'jquery';
import Player from '@/components/Player';

export default new Vue({
	data: {
		// Массив со всеми станциями
		stationsArray: {},
		// Массив со всеми станциями, только станции сгруппированы в массивы по 100шт
		stationsArrayOn100: [],
		// префикс для url API для android на cordova
		androidPrefix: '',
		xhrResponceRecieved: false
	},
	methods: {
		clearLocalStorage () {
			localStorage.clear();
			console.log('Clear Local storage');
			$('body').append('<div>Clear Local storage');
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
						this.stationsArray = (response.data);
						console.log('::xhr:stop:succecc');

						var size 		= 0;
						for (var key in this.stationsArray) {
							size++;
						}
						var totalArrays = Math.ceil(size / 100);

						// массив имен станций
						// нужен для правильного получения stationsIndex
						var keys = [];

						for(var key in this.stationsArray) {
							keys.push(key);
						}

						for (var i = 0; i < totalArrays; i++) {
							this.stationsArrayOn100[i] = [];
							for (var j = 0; j < 100; j++) {
								var stationsIndex = keys[i * 100 + j];
								
								if(i == totalArrays - 1 && j == size % 100) {
									break;
								}

								this.stationsArrayOn100[i][j] = this.stationsArray[stationsIndex];
							}
						}

						console.log('::PlayerData:$emit:dataTransfer:xhr');
						// здесь Player хоть и успевает создаться, пусть тоже стоит маленькая задержка
						setTimeout(() => {
							this.$emit('dataTransfer', this.stationsArray, this.stationsArrayOn100);
						}, 50);
						this.xhrResponceRecieved = true;

						localStorage.setItem('stations', JSON.stringify(this.stationsArray));
						localStorage.setItem('stationsOn100', JSON.stringify(this.stationsArrayOn100));

						$('body').append('<div>Data from Database success and placed in localstorage');

						// location.reload();
					} catch(e) {
						console.log('::xhr:stop:fail');
						console.log('Error::No response');
						throw new Error(e);
						$('#app').addClass('js-error error-no-response-data');
						$('body').append('<div>Data from Database failed');
					}
				})
				.catch((error) => {
					console.log('Error::не удалось создать ajax-запрос');
					$('body').append('<div>Ajax failed');
					// TODO: переделать на добавление класса объекту Vue
					$('#app').addClass('js-error error-ajax-query');
					console.log(error)
				});
		}
	},
	created () {
		/*let path = window.location.pathname;
		console.log(path);
		$('body').append('<div>' + path);*/
		console.log('::PlayerData:hook:created');

		console.log('::PlayerData:method:getAllStations');
		if(localStorage.getItem('stations') == undefined) {
			console.log('::Need ajax for allStations list');
			$('body').append('<div>Data from local storage is empty, need ajax for data list');

			let urlApi = this.androidPrefix + '/api/actions.php';
			console.log(urlApi);

			this.getAllStations(this.androidPrefix + '/api/actions.php');
		} else {
			console.log('::PlayerData:Get stations from Local storage');
			$('body').append('<div>Data from local storage success');
			this.stationsArray 		= JSON.parse(localStorage.getItem('stations'));
			this.stationsArrayOn100 	= JSON.parse(localStorage.getItem('stationsOn100'));
			this.xhrResponceRecieved = true;

			console.log('::PlayerData:$emit:dataTransfer:ls');
			// передача с отсрочкой, потому что Player не успевает создаться, пусть тоже стоит задержка
			setTimeout(() => {
				this.$emit('dataTransfer', this.stationsArray, this.stationsArrayOn100);
			}, 100);
		}
	}
});
