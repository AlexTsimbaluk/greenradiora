<template>
	<i
		:class="[t == 'light' ? 'md-light' : 'md-dark']"
		class="material-icons"
	>{{i}}</i>
</template>

<script>
	export default {
		name: 'm-icon',
		props: {
			i: {
				type: String,
				reqired: true
			},
			t: {
				type: String,
				reqired: false
			}
		},
		data () {
			return {
				
			}
		}
	}
</script>