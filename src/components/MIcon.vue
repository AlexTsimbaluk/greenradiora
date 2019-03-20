<template>
	<i
		:class="[t == 'light' ? 'md-light' : 'md-dark', s != undefined ? `md-${s}` : 'md-24']"
		class="material-icons"
	>{{i}}</i>
</template>

<script>
	export default {
		name: 'm-icon',
		props: {
			// icon content
			i: {
				type: String,
				reqired: true
			},
			// icon theme
			t: {
				type: String,
				reqired: false
			},
			// icon size
			s: {
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