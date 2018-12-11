import Vue from 'vue';
import axios from 'axios';

export default new Vue({
	data: {
		// инициализировалась ли cordova
		cordovaReady: false,
		// Массив со всеми станциями
		stationsArray: {},
		// префикс для url API для android на cordova
		// apiPrefix: 'https://cors-anywhere.herokuapp.com/http://radiora.ru',
		// apiPrefix: 'http://radiora.ru',
		apiPrefix: '',
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
		getAllStations (urlApi) {
			console.log('::xhr:start');
			if(true) {
				axios
					.post(
						// urlApi,
						// 'http://greenra/api/actions.php',
						'/api/actions.php',
						{
							actions: 'getAllStations'
						}
						/*{
							headers: {'X-Requested-With': 'XMLHttpRequest'}
						}*/
						/*{
							transformRequest: [
								function (data, headers) {
									let formdata = new FormData();
									formdata.append('action', 'getAllStations');
									console.log(formdata);
									return formdata;
								}
							]
						}*/
					)
					.then((response) => {
						try {
							console.log('::xhr:stop:succecc');
							this.stationsArray = (response.data);

							this.xhrResponceRecieved = true;
							localStorage.setItem('stations', JSON.stringify(this.stationsArray));

							console.log('::PlayerData:$emit:dataTransfer:xhr');
							this.dataTransfer(50);

							console.log('::Data from Database success and placed in localstorage');

							// location.reload();
						} catch(e) {
							console.log('::xhr:stop:fail');
							console.log('Error::No response');
							throw new Error(e);
							console.log('::Data from Database failed');
						}
					})
					.catch((error) => {
						console.log('Error::не удалось создать ajax-запрос');
						console.log('::Ajax failed');
						// TODO: переделать на добавление класса объекту Vue
						console.log(error);
						console.log(error.message);
					});
			} else {
				let xhr = new XMLHttpRequest();

				xhr.open("POST", 'http://greenra/api/actions.php', true);
				// xhr.open("POST", 'http://radiora.ru/actions.php', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.setRequestHeader('Requested-With', 'XMLHttpRequest');

				xhr.onload = function(ev) {
					if (this.status == 200) {
						console.log('==========xhr:onload:200==========');
						console.log(ev);
						console.log(this.response);
						console.log(this.status);

						var data = JSON.parse(this.response);
						console.log(data);
					}
				};

				xhr.onerror = (err) => {
					console.log(err);
					console.log('==========xhr::onerror==========');
				};

				xhr.onreadystatechange = (st) => {
					console.log(st);
				};

				xhr.send('actions=getAllStations');
			}

		}
	},
	created () {
		// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		console.log('::PlayerData:hook:created');
		console.log('::PlayerData:method:getAllStations');


		console.log('axios test');

		axios.post('/api/test-axios.php', {
				name: 'testPOST'
			})
			.then(function (response) {
				console.log('success');
				console.log(response.data);
				
				axios.get(
					'/api/test-axios.php?name=testGET')
					.then(function (response) {
						console.log('success');
						console.log(response.data);
					})
					.catch(function (error) {
						console.log('error');
						console.log(error);
					})
					.then(function () {
						console.log('always');
					});	
			})
			.catch(function (error) {
				console.log('error');
				console.log(error);
			})
			.then(function () {
				console.log('always');
			});

		if(localStorage.getItem('stations') == undefined) {
			console.log('::Need ajax for allStations list');
			console.log('::Data from local storage is empty, need ajax for data list');

			let urlApi = this.apiPrefix + '/api/actions.php';
			
			console.log('hostname=' + window.location.hostname);
			console.log('host=' + window.location.host);
			console.log('hash=' + window.location.hash);
			console.log('href=' + window.location.href);
			console.log('origin=' + window.location.origin);
			console.log('urlApi=' + urlApi);

			if(!this.cordovaReady) {
				this.getAllStations(this.apiPrefix + '/api/actions.php');
				// this.getAllStations(this.apiPrefix + '/actions.php');
			}
		} else {
			console.log('::PlayerData:Get stations from Local storage');
			this.stationsArray 		= JSON.parse(localStorage.getItem('stations'));
			this.xhrResponceRecieved = true;

			console.log('::PlayerData:$emit:dataTransfer:ls');
			this.dataTransfer(100);
		}		
	}
});
