<template>
	<div class="d-flex flex-shrink-0 row no-gutters py-2 position-relative px-2 user-panel">
			<!-- :station="stationsArray[track]" -->
			<!-- :class="{playing: state.nowPlaying.track && state.nowPlaying.track.station_id == track}" -->
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
						class="md-24"
						:i="animation.icon"
						:class="[state.animationState[animation.name] ? '' : 'md-inactive']"
						:t="'light'"
					></m-icon>
					<ripple></ripple>
				</button>

				<button
					class="btn btn-outline-info btn-fab btn-round"
					@click="translate()"
				>
					<m-icon
						class="md-24"
						:i="'translate'"
						:class="[state.translated ? '' : 'md-inactive']"
						:t="'light'"
					></m-icon>
					<ripple></ripple>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';


	import PlayerData from '@/PlayerData.js';
	import PlayerState from '@/PlayerState.js';
	import PlayerAudio from '@/PlayerAudio.js';

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
			console.log('@@@ UserPanel:hook:created');

			// console.log(this.state.animationState);
			// console.log(PlayerState.playerState.animationState);
		}
	}
</script>

<style></style>