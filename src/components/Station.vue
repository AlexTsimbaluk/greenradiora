<template>
	<div class="station">
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
				
			}
		},
		created () {
			
		}
	}
</script>

<style lang="less">
	.station {
		.url {
			
		}
	}
</style>