<template>
  <div id="app">
	<router-view/>
	
  </div>
</template>

<script>
export default {
	name: 'App',
	data () {
		return {

		}
	}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000;
}

#app.error-no-response-data {
	color: #ff0;
}
#app.error-ajax-query {
	color: #f00;
}
</style>
