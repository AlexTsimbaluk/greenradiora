<template>
	<div class="d-flex flex-shrink-0 row no-gutters py-2 position-relative px-2 user-panel">
			<!-- :station="stationsArray[track]" -->
			<!-- :class="{playing: state.nowPlaying.track && state.nowPlaying.track.station_id == track}" -->
		<a
			v-if="device != 'android'"
			href="app-debug.apk"
			download="radiora-apk.apk"
			class="btn btn-outline-info btn-fab btn-round"
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

<style></style>