<template>
	<div class="log w-100 d-flex flex-column-reverse">
		<div class="d-flex flex-row-reverse flex-shrink-0">
			<div class="controls d-flex">
				<button
					class="btn btn-default btn-fab btn-round btn-control"
					@click="clearLocalStorage"
				>
					<m-icon
						:i="'cached'"
					></m-icon>
					<ripple></ripple>
				</button>
				
				<button
					class="btn btn-default btn-fab btn-round btn-control"
					@click="locationReload"
				>
					<m-icon
						:i="'autorenew'"
					></m-icon>
					<ripple></ripple>
				</button>

				<button 
					class="btn btn-default btn-fab btn-round btn-control clear"
					@click="clear"
					:disabled="!logs.length"
				>
					<m-icon
						:class="[!!logs.length ? '' : 'md-inactive']"
						:i="'not_interested'"
					></m-icon>
					<ripple></ripple>
				</button>
				
				<button
					class="btn btn-default btn-fab btn-round btn-control showLog"
					@click="logVisible = !logVisible"
				>
					<m-icon
						:i="'bug_report'"
						:t="logVisible ? 'light' : ''"
					></m-icon>
					<ripple></ripple>
				</button>
			</div>
		</div>

		<div
			v-if="logVisible"
			class="log-list"
		>
			<div
				class="log-item && logs.length"
				v-for="(log, index) in logs"
			>
				#{{logs.length - index}} {{ log }}
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
				logVisible: false,

				locationReload: Utils.locationReload,
				clearLocalStorage: Utils.clearLocalStorage
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

// <style>
</script>

<style lang="less">
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
	line-height: 1.7;
}

.controls {
	padding: 5px 0;
}
</style>