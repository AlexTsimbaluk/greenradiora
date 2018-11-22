import Vue from 'vue';

export default new Vue({
	data () {
		return {

		}
	},
	methods: {
		getRandomInt (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		logs (text) {
			this.$emit('log', text);
		}
	},
	created () {
		console.log('::Utils:hook:created');
		this.$emit('log', '::Utils::created');
	}
});
