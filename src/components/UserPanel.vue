<template>
	<div class="d-flex flex-shrink-0 row no-gutters py-2 position-relative px-2 user-panel">
			<!-- :station="stationsArray[track]" -->
			<!-- :class="{playing: state.nowPlaying.track && state.nowPlaying.track.station_id == track}" -->
		<div class="d-flex col">
			<a
				v-if="device != 'android'"
				href="app-debug.apk"
				download="radiora-apk.apk"
				class="btn btn-outline-info btn-fab btn-round"
				title="Download apk"
			>
				<m-icon
					:i="'phone_android'"
					:t="'light'"
					:s="'20'"
				></m-icon>
				<ripple></ripple>
			</a>

			<a
				v-if="device == 'android'"
				href="http://vuea.radiora.ru/"
				class="btn btn-outline-info btn-fab btn-round"
			>
				<m-icon
					:i="'laptop'"
					:t="'light'"
					:s="'20'"
				></m-icon>
				<ripple></ripple>
			</a>

			<div
				v-for="(animation, key) in state.animations"
				:key="animation.name"
			>
				<div
					class="d-flex"
				>
					<button
						class="btn btn-outline-info btn-fab btn-round"
						@click="toggleAnimation($event, animation)"
					>
						<m-icon
							:i="animation.icon"
							:class="[state.animationState[animation.name] ? '' : 'md-inactive']"
							:t="'light'"
						></m-icon>
						<ripple></ripple>
					</button>

				</div>
			</div>

			<button
				class="btn btn-outline-info btn-fab btn-round"
				@click="translate()"
			>
				<m-icon
					:i="'translate'"
					:class="[state.translated ? '' : 'md-inactive']"
					:t="'light'"
				></m-icon>
				<ripple></ripple>
			</button>
		</div>

		<div class="d-flex">
			<button
				class="btn btn-outline-info btn-fab btn-round"
				@click="clearLocalStorage()"
			>
				<m-icon
					:i="'cached'"
					:t="'light'"
				></m-icon>
				<ripple></ripple>
			</button>
			
			<button
				class="btn btn-outline-info btn-fab btn-round"
				@click="locationReload()"
			>
				<m-icon
					:i="'autorenew'"
					:t="'light'"
				></m-icon>
				<ripple></ripple>
			</button>

			<!-- <button
				class="btn btn-outline-info btn-fab btn-round btn-control"
				@click="toggleOpacityRange"
			>
				<m-icon
					:i="'settings'"
					:t="!logVisible ? 'light' : ''"
				></m-icon>
				<ripple></ripple>
			</button> -->

				<!-- :disabled="!logs.length" -->
			<button 
				class="btn btn-outline-info btn-fab btn-round"
				@click="clearLog"
			>
					<!-- :class="[!!logs.length ? '' : 'md-inactive']" -->
				<m-icon
					:i="'not_interested'"
					:t="'light'"
				></m-icon>
				<ripple></ripple>
			</button>
			
				<!-- @click="$emit('toggleLog')" -->
			<button
				class="btn btn-outline-info btn-fab btn-round"
				@click="toggleLog"
			>
				<m-icon
					:i="'bug_report'"
					:t="'light'"
				></m-icon>
				<ripple></ripple>
			</button>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';


	import PlayerData from '@/PlayerData.js';
	import PlayerState from '@/PlayerState.js';
	import Cordova from '@/Cordova.js';

	import Utils from '@/Utils.js';

	export default {
		name: 'user-panel',
		props: {
			state: {
				type: Object,
				reqired: true
			}
		},
		data () {
			return {
				device: ''
			}
		},
		methods: {
			toggleAnimation (event, animation) {
				PlayerState.toggleAnimation (event, animation);
			},
			translate () {
				PlayerState.translate();
			},
			clearLocalStorage () {
				Utils.clearLocalStorage();
			},
			locationReload () {
				Utils.locationReload();
			},
			toggleLog () {
				Utils.toggleLog();
				console.log('toggleLog');
			},
			clearLog () {
				Utils.clearLog();
			}
		},
		created () {
			Utils.logs('@@@ UserPanel:hook:created');

			Cordova.$on('device', (device) => {
				Utils.logs('@@@ UserPanel:$on:device');
				this.device = device;
				Utils.logs(this.device);
			});
		}
	}
</script>

<style>
	.user-panel .btn {
		margin-left: 0 !important;
	}
</style>