<template>
	<div class="log">
		<div
			class="log-item"
			v-for="log in logs"
		>
			{{ log }}
		</div>
	</div>
</template>



<script>

	import Utils from '@/Utils.js';

	export default {
		name: 'Log',
		data () {
			return {
				logs: []
			}
		},
		methods: {
			
		},
		created () {
			console.log('::Log:hook:created');

			Utils.$on('log', (text) => {
				this.logs.push(text);
				console.log(text);
			});
		}
	}

</script>



<style lang="less">
.log {
	position: absolute;
	top: 0;
}
	.log-item {
		color: #00f;
		font-family: monospace;
	}
</style>