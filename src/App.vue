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


Vue.component('Log', Log);


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
</style>
