import Vue from 'vue';
import axios from 'axios';
import $ from 'jquery';
import Player from '@/components/Player';

export default new Vue({
	data: {
		// Массив со всеми станциями
		stationsArray: {},

		// Массив со всеми станциями, только станции сгруппированы в массивы по 100шт
		stationsArrayOn100: []
	},
	methods: {
		cordovaUrl (url) {
			console.log(device);
			var path = window.location.pathname;

			if (device.platform.toLowerCase() == 'android') {
					// url = '/platforms/android/app/src/main/assets/www' + url;
			} else if (device.platform.toLowerCase() == 'browser') {
					url = path.substring(0, path.lastIndexOf('/')) + url;
			}
			console.log(url);
			return url;
		},
		getAllStations () {
			console.log('::PlayerData.getAllStations');

			// варианты с запросом
			// 1
			// добавить прокси если в config/index.js dev.proxyTable.target = 'http://greenradiora.ru'
			// https://ru.stackoverflow.com/questions/772198/react-axios-no-access-control-allow-origin-header-is-present-on-the-requested
			// тогда вместо
			// axios.post(url).then()
			// будет
			// const proxy = "https://cors-anywhere.herokuapp.com/";
			// axios.post(proxy + url).then()

			// 2
			// https://toster.ru/q/454760
			// прописать origin ('Access-Control-Allow-Origin') в хедер ответа сервера. Это адреса хостов, к которым разрешены внешние запросы.
			// судя по всему, в db_connection.php
			// <?php header("Access-Control-Allow-Origin: *"); ?>

			if(localStorage.getItem('stations') == undefined) {
				console.log('::Need ajax for allStations list');
				$('body').append('<div>Data from local storage is empty, need ajax for data list');

				let formdata = new FormData();
				formdata.append('action', 'getAllStations');

				axios
				// .post('http://greenradiora.ru/actions.php', formdata)
				// .post('http://greenra/api/actions.php', formdata)
				// .post('/api/getAllStations.php')
				.post('/api/actions.php', formdata)
				.then((response) => {
					try {
						this.stationsArray = (response);

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
							this.stationsArrayOn100[i] = [];  // TODO здесь баги
							for (var j = 0; j < 100; j++) {
								var stationsIndex = keys[i * 100 + j];
								// если последняя станция - break
								// почему?
								// return?
								if(i == totalArrays - 1 && j == size % 100) {
									break;
								}
								// TODO
								//  сделать проверку что this.stationsArray[stationsIndex] не null
								this.stationsArrayOn100[i][j] = this.stationsArray[stationsIndex];
							}
						}

						Player.stationsArray = this.stationsArray.data;
						Player.stationsArrayOn100 = this.stationsArrayOn100;
						Player.station = Player.stationsArray['11'];

						console.log(this.stationsArray.data['11'].station_title);
						console.log(Player.station.station_title);

						localStorage.setItem('stations', JSON.stringify(this.stationsArray));
						localStorage.setItem('stationsOn100', JSON.stringify(this.stationsArrayOn100));

						$('body').append('<div>Data from Database success and placed in localstorage');

						// location.reload();
					} catch(e) {
						console.log('Error::response is empty');
						$('#app').addClass('js-error error-no-response-data');
						throw new Error(e + ':' + response);
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
			} else {
				console.log('::Get stations from Local storage');
				$('body').append('<div>Data from local storage success');
				this.stationsArray 		= JSON.parse(localStorage.getItem('stations'));
				this.stationsArrayOn100 	= JSON.parse(localStorage.getItem('stationsOn100'));
			}
		}
	},
	created () {
	}
});
