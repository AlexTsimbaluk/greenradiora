import Vue from 'vue';
// import Utils from '@/Utils.js';

export default new Vue({
	data () {
		return {

		}
	},
	methods: {
		createdInfo () {
			console.log('host=' + window.location.host);
			console.log('hostname=' + window.location.hostname);
			console.log('pathname=' + window.location.pathname);
			console.log('hash=' + window.location.hash);
			console.log('href=' + window.location.href);
			console.log('origin=' + window.location.origin);
		},
		clearLocalStorage () {
			localStorage.clear();
			this.logs('::Clear Local storage');
			setTimeout(() => {
				location.reload();
			}, 1000);
		},
		getRandomInt (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		locationReload () {
			setTimeout(() => {
				location.reload();
			}, 100);
		},
		logs (text) {
			this.$emit('log', text);
		}
	},
	created () {
		console.log('::Utils:hook:created');
	}
});
