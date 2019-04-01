import Vue from 'vue';

export default new Vue({
	data () {
		return {

		}
	},
	methods: {
		locationInfo () {
			console.log('');

			for(let key in location) if(typeof location[key] == 'string') {
				console.log(key + '::' + location[key]);
			}

			console.log('');
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
		},

		toggleLog () {
			this.$emit('toggleLog');
		},

		clearLog () {
			this.$emit('clearLog');
		},

		setCursorPosition(input, start, end) {
			if (input.setSelectionRange) {
				input.focus();
				input.setSelectionRange(start, end);
			}
		},

		round(val, precission) {
			if(typeof val == 'number') {
				return +(val.toFixed(precission ? precission : 0));
			}
		}
	},
	created () {
		console.log('@@@ Utils:hook:created');

		// this.locationInfo();
	}
});
