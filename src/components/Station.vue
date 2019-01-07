<template>
	<div
		@click="togglePlaying($event)"
		class="station"
	>
		<div class="station-title">
			{{ station.station_title }}
		</div>

		<div class="station-url">
			{{ station.station_url }}
		</div>
	</div>
</template>

<script>
	import PlayerData from '@/PlayerData.js';
	import PlayerState from '@/PlayerState.js';

	export default {
		name: 'Station',
		props: {
			station: {
				type: Object,
				reqired: true
			}
		},
		data () {
			return {
				
			}
		},
		methods: {
			togglePlaying(event) {
				// console.log(PlayerState.playerTag.src);
				// PlayerState.playerTag.volume = 1;
				// PlayerState.playerTag.src = this.station.station_url;
				// PlayerState.playerTag.src = 'http://serv02.streamsfortheworld.com:8000/radiosama_low';
				// PlayerState.playerTag.src = 'http://icecast.norecords.org:8000/nrc-320.mp3';
				// PlayerState.playerTag.src = 'http://manehattan.bronytunes.com:80/stream-32.btr';
				if(PlayerState.playerState.paused) {
					console.log('Station::Play');
					PlayerState.playStream(this.station.station_url);
				} else {
					console.log('Station::Stop');
					PlayerState.stopStream();
				}
			}
		},
		created () {
			// console.log('::Station:hook:created');
			// this.player = PlayerState.getAudioTag('playerTag');
			// console.log(this.player);
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
</style>