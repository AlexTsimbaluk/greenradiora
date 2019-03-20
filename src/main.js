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
	}
});
