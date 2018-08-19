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
	import PlayerData from '@/PlayerData.js';

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
			// this.log('::Player:$on:dataTransfer');

			PlayerData.$on('log', (text) => {
				this.logs.push(text);
			});
		}
	}
</script>

<style lang="less">
	.log-item {
		color: #00f;
		font-family: monospace;
	}
</style>