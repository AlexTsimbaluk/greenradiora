<template>
	<div
		id="app"
		class="d-flex flex-column justify-content-center"
	>
		<router-view/>
		
		<log></log>		
	</div>
</template>



<script>

import Vue from 'vue';

import Utils from '@/Utils.js';

import Log from '@/components/Log';
import Loader from '@/components/Loader';
import Ripple from '@/components/Ripple';
import MIcon from '@/components/MIcon';

import Focus from '@/directives/Focus.js';
import Scroll from '@/directives/Scroll.js';


Vue.component('Log', Log);
Vue.component('Ripple', Ripple);
Vue.component('MIcon', MIcon);
Vue.component('Loader', Loader);


Vue.directive('focus', Focus);
Vue.directive('scroll', Scroll);


export default {
	name: 'App',
	data () {
		return {

		}
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
