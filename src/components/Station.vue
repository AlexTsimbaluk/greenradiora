<template>
	<div class="station">
		<div class="title">
			{{ station.station_title }}
		</div>

		<div class="url">
			{{ station.station_url }}
		</div>

		{{ fake }}
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
				title: '',
				url: '',
				fake: 'aaa'
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