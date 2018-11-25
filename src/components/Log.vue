<template>
	<div class="log w-100">
		<div
			class="log-item"
			v-for="log in logs"
		>
			{{ log }}
		</div>

		<div 
			class="clear"
			@click="clear"
		>
			X
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
			clear () {
				this.logs = [];
			}
		},
		created () {
			console.log('::Log:hook:created');

			Utils.$on('log', (text) => {
				this.logs.unshift(text);
				console.log(text);
			});
		}
	}

</script>


 lang="less"
<style>
.log {
	height: 160px;
	overflow-y: auto;
	padding: 8px;
	position: absolute;
	top: 0;
}
.log-item {
	color: #00f;
	font-family: monospace;
}
.clear {
	cursor: pointer;
	position: absolute;
	right: 10px;
	top: 10px;
}
</style>