<template>
	<div
		id="app"
		:style="{opacity: appOpacity}"
		class="d-flex flex-column justify-content-center"
		ref="app"
	>
		<router-view/>
		
		<log
			@setAppOpacity="setAppOpacity($event)"
		></log>

		<fractal></fractal>
	</div>
</template>



<script>

import Vue from 'vue';

// import Rx from 'rxjs/Rx';
// import VueRx from 'vue-rx';

import Utils from '@/Utils.js';

import Log from '@/components/Log';
import Loader from '@/components/Loader';
import Ripple from '@/components/Ripple';
import MIcon from '@/components/MIcon';
import Fractal from '@/components/Fractal';


import Focus from '@/directives/Focus.js';
import Scroll from '@/directives/Scroll.js';


Vue.component('Log', Log);
Vue.component('Loader', Loader);
Vue.component('Ripple', Ripple);
Vue.component('MIcon', MIcon);
Vue.component('Fractal', Fractal);


Vue.directive('focus', Focus);
Vue.directive('scroll', Scroll);


// Vue.use(VueRx, Rx);


export default {
	name: 'App',
	data () {
		return {
			appOpacity: 1
		}
	},
	methods: {
		setAppOpacity (event) {
			this.appOpacity = event;
			this.$emit('opacityChanged', this.appOpacity);
		}
	},
	created () {
		this.$emit('opacityChanged', this.appOpacity);
	}
}

</script>



<style lang="less">
@import "../static/less/main.less";
</style>

<style lang="sass">
@import '../node_modules/bootstrap/scss/bootstrap.scss';
@import '../node_modules/material-kit/assets/scss/material-kit.scss';
@import '../node_modules/animate.css/animate.min.css';
</style>
