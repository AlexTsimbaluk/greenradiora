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
			// icon content
			i: {
				type: String,
				reqired: true
			},
			// icon theme
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