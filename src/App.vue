<template>
	<div id="app">
		<router-view/>
		
		<log></log>
	</div>
</template>



<script>

import Vue from 'vue';
import Utils from '@/Utils.js';
import Log from '@/components/Log';
import Ripple from '@/components/Ripple';

/*import $ from '../node_modules/material-kit/assets/js/core/jquery.min.js';
import Popper from '../node_modules/material-kit/assets/js/core/popper.min.js';
import bmd from '../node_modules/material-kit/assets/js/core/bootstrap-material-design.min.js';
import MKit from '../node_modules/material-kit/assets/js/material-kit.min.js';*/


Vue.component('Log', Log);
Vue.component('Ripple', Ripple);


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
</style>
