<template>
	<div
		@click="togglePlaying($event)"
		class="d-flex flex-column no-gutters station"
	>
		<div class="station-title col">
			{{ station.station_title }}
		</div>

		<div class="station-url col">
			{{ station.station_url }}
		</div>

		<button
			v-if="search"
			class="btn btn-info btn-link btn-fab btn-round deleteStation position-absolute"
			@click.stop="addStation(station)"
		>
			<m-icon
				class="md-24"
				:i="'add'"
				:t="'light'"
			></m-icon>
			<ripple></ripple>
		</button>

		<button
			v-else
			class="btn btn-info btn-link btn-fab btn-round deleteStation position-absolute"
			@click.stop="deleteStation(station)"
		>
			<m-icon
				class="md-24"
				:i="'close'"
				:t="'light'"
			></m-icon>
			<ripple></ripple>
		</button>
	</div>
</template>

<script>
	import PlayerData from '@/PlayerData.js';
	import PlayerState from '@/PlayerState.js';

	/*import { Observable, from } from 'rxjs';
	import Rx from 'rxjs/Rx';


	const messageObservable = Rx.Observable.of(
		PlayerState
	);*/

	export default {
		name: 'Station',
		props: {
			station: {
				type: Object,
				reqired: true
			},
			search: {
				type: Boolean,
				reqired: false
			}
		},
		data () {
			return {
				
			}
		},
		methods: {
			togglePlaying(event) {
				// PlayerState.playerTag.src = 'http://serv02.streamsfortheworld.com:8000/radiosama_low';
				// PlayerState.playerTag.src = 'http://icecast.norecords.org:8000/nrc-320.mp3';
				// PlayerState.playerTag.src = 'http://manehattan.bronytunes.com:80/stream-32.btr';
				

				/*if(PlayerState.playerState.paused) {
					console.log('Station::Play');
					PlayerState.playStream(this.station);
				} else if(PlayerState.nowPlaying && PlayerState.nowPlaying.track.station_id == station.station_id) {
					console.log('Station::Stop');
					PlayerState.stopStream();
				} else {
					console.log('else');
				}*/
				
				PlayerState.togglePlaying(this.station);
			},
			addStation (station) {
				this.$emit('addStation');
				PlayerState.addStation(station);
			},
			deleteStation (station) {
				PlayerState.deleteStation(station);
			}
		},
		created () {
			
		}
	}
</script>

<style lang="less">
	.station {
		&.playing {
			box-shadow: inset 0 0 28px 2px #00afc5;
			transition: all 1s;
		}
	}
	.deleteStation {
		position: absolute ;
		right: -10px;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
	}
</style>