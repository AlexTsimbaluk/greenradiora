<template>
	<div class="log w-100">
		<button 
			class="btn btn-info btn-fab clear"
			@click="clear"
		>
			<i class="material-icons">not_interested</i>
		</button>

		<button
			class="btn btn-info btn-fab showLog"
			@click="logVisible = !logVisible"
		>
			<i class="material-icons">bug_report</i>
		</button>
		
		<div v-if="logVisible">
			<div
				class="log-item"
				v-for="log in logs"
			>
				{{ log }}
			</div>
		</div>
	</div>
</template>



<script>

	import Utils from '@/Utils.js';

	export default {
		name: 'Log',
		data () {
			return {
				logs: [],
				logVisible: false
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
	bottom: 0;
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