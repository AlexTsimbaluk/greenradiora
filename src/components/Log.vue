<template>
	<div
		class="log w-100 d-flex flex-column-reverse justify-content-between"
		:class="{active: logVisible}"
	>
		<div class="d-flex flex-row-reverse flex-shrink-0">
			<div class="controls d-flex">
				<!-- <button
					class="btn btn-default btn-fab btn-round btn-control"
					@click="playerDataInit"
				>
					<m-icon
						:i="'signal_wifi_off'"
					></m-icon>
					<ripple></ripple>
				</button> -->

				<button
					class="btn btn-default btn-fab btn-round btn-control"
					@click="toggleOpacityRange"
				>
					<m-icon
						:i="'settings'"
						:t="opacityRangeVisible ? 'light' : ''"
					></m-icon>
					<ripple></ripple>
				</button>

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
					class="btn btn-default btn-fab btn-round btn-control"
					@click="toggleLog"
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
			v-if="logVisible && logs.length"
			class="flex-grow-1 log-list-container"
		>
			<div
				class="h-100 log-list"
			>
				<div
					class="log-item"
					v-for="(log, index) in logs"
				>
					#{{index}} {{ log }}
				</div>

			</div>
		</div>
		
		<div
			v-if="logVisible && opacityRangeVisible"
			class="m-auto"
		>
				<!-- v-model="state.volume" -->
			<input
				@change="setAppOpacity($event)"
				@opacityChanged="opacityChanged(event)"
				class="d-flex align-items-center"
				type="range"
				min="0.5"
				max="1"
				:value="appOpacity"
				step="0.01"
			/>
		</div>
	</div>
</template>



<script>

	import Utils from '@/Utils.js';
	import PlayerData from '@/PlayerData.js';

	export default {
		name: 'Log',
		data () {
			return {
				logs: [],
				logVisible: false,
				logEl: null,

				locationReload: Utils.locationReload,
				clearLocalStorage: Utils.clearLocalStorage,

				opacityRangeVisible: false,
				appOpacity: 1
			}
		},
		methods: {
			toggleLog () {
				let self = this;
				this.logVisible = !this.logVisible;

				if(!this.logVisible) {
					this.opacityRangeVisible = false;
				}

				if(this.logVisible) {
					setTimeout(function() {
						self.logEl = document.querySelector('.log-list');

						if(self.logEl != undefined) {
							// self.logEl.scrollTo({top: self.logEl.scrollHeight, behavior: 'smooth'});
							// self.logEl.scrollTo(0, self.logEl.scrollHeight);
							self.logEl.scrollTop = self.logEl.scrollHeight;
						}
					}, 100);
				}
			},
			add (text) {
				let self = this;
				this.logs.push(text);
				console.log(text);

				if(this.logVisible) {
					setTimeout(function() {
						// this.logEl.lastChild && this.logEl.lastChild.scrollIntoView(false);
						// self.logEl.scrollTo(0, self.logEl.scrollHeight);
						
						if(self.logEl != undefined) {
							self.logEl.scrollTop = self.logEl.scrollHeight;
						}
					}, 100);
				}
			},
			clear () {
				this.logs = [];
			},
			playerDataInit () {
				PlayerData.init();
			},
			toggleOpacityRange () {
				if(!this.logVisible) {
					this.logVisible = true;
				}

				this.clear();
				this.opacityRangeVisible = !this.opacityRangeVisible;
			},
			setAppOpacity (event) {
				let opacity = +event.target.value;

				this.$emit('setAppOpacity', opacity);
			},
			opacityChanged (event) {
				this.appOpacity = event;
			}
		},
		created () {
			console.log('@@@ Log:hook:created');

			Utils.$on('log', (text) => {
				this.add(text);
			});
		}
	}

</script>

<style>
.log {
	padding: 0 8px;
	bottom: 0;
	overflow-y: hidden;
}
.log.active {
	height: 30vh;
	background: #cfcfcf;
}
.log-list-container {
	flex: 0 1 100%;
	overflow-y: hidden;
}
.log-list {
	padding: 0 6px;
	overflow-y: auto;
	scroll-behavior: smooth;
	/*scroll-behavior: instant;*/
}
.log-item {
	color: #404040;
	font-family: monospace;
	line-height: 1.7;
}

.controls {
	padding: 5px 0;
}
</style>