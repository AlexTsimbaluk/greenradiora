<template>
	<div
		class="station"
		@click="togglePlaying"		
	>
		<div class="title">
			{{ station.station_title }}
		</div>

		<div class="url">
			{{ station.station_url }}
		</div>
	</div>
</template>

<script>
	import PlayerData from '@/PlayerData.js';

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
				playing: false
			}
		},
		methods: {
			togglePlaying() {
				console.log('Station::togglePlaying');
				// console.log(PlayerData.playerTag.src);
				PlayerData.playerTag.volume = 1;
				// PlayerData.playerTag.src = this.station.station_url;
				// PlayerData.playerTag.src = 'http://serv02.streamsfortheworld.com:8000/radiosama_low';
				PlayerData.playerTag.src = 'http://icecast.norecords.org:8000/nrc-320.mp3';
				if(!this.playing) {
					PlayerData.playerTag.play();
					this.playing = !this.playing;
				} else {
					PlayerData.playerTag.pause();
					this.playing = !this.playing;
				}
			}
		},
		created () {
			console.log('::Station:hook:created');
		}
	}
</script>

<style lang="less">
	.station {
		.url {
			
		}
	}
</style>