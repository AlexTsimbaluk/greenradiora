<template>
	<div class="log w-100 d-flex flex-column-reverse">
		<div class="controls d-flex flex-row-reverse flex-shrink-0">
			<button 
				class="btn btn-default btn-fab btn-round clear"
				@click="clear"
			>
				<m-icon
					:i="'not_interested'"
				></m-icon>
				<ripple></ripple>
			</button>
			<button
				class="btn btn-default btn-fab btn-round showLog"
				@click="logVisible = !logVisible"
			>
				<m-icon
					:i="'bug_report'"
				></m-icon>
				<ripple></ripple>
			</button>
		</div>

		<div
			v-if="logVisible"
			class="log-list"
		>
			<div
				class="log-item && logs.length"
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


<style>
.log {
	height: 160px;
	padding: 0 8px;
	position: absolute;
	bottom: 0;
	overflow-y: hidden;
}
.log-list {
	overflow-y: auto;
}
.log-item {
	color: #00f;
	font-family: monospace;
}

.controls {
	padding: 5px 0;
}
.clear,
.showLog {
	cursor: pointer;
	margin: 0 5px;
}
</style>