import Vue from 'vue';

export default new Vue({
	data () {
		return {
			playerState: {
				playlists: {},
				playlistsOrder: [],
				currentPlaylist: '',
				nowPlaying: {},
				volume: .27,
				// paused: player.paused,
				search: {
					stationsOpened: []
				},
				translated: false
			},
			__playlists: {}
		}
	},
	methods: {
		Playlist (name, opts) {
			this.name = name;
			this.tracks = [];
			this.currentTrack = {};

			playerState.currentPlaylist = this.name;
			playerState.playlistsOrder.push(this.name);

			__playlists[name] = this;

			localStorage.setItem('playerState', JSON.stringify(playerState));
			localStorage.setItem('__playlists', JSON.stringify(__playlists));
		},
		init () {
			let nirvanaPlaylist          	= new this.Playlist('~Nirvana~'); // ?? - нужен ??
			let dubstepPlaylist          	= new this.Playlist('Dubstep');
			let dubPlaylist 	         	= new this.Playlist('|_Dub_|');

			nirvanaPlaylist.tracks       	= [
							1330,		// graal future
							1193,		// graal space
							883,		// Drum and Bass) (Uturn Radio
							3207,		// TECHNO4EVER.FM HARD
							884,		// TeaTime.FM - 24h Happy Hardcore, Drum and Bass, UK
							3771,		// CoreTime.FM - 24h Hardcore, Industrial, Speedcore
							3210,		// Make Some Noise
							7942		// не воспроизводится - для отладки ошибок
			];

			dubstepPlaylist.tracks       	= [
							2599,		// Walmer Radio
							55,			// Dub & Bass
							2403,		// DubTerrain.net
							2409,		// Dubstep.fm - 128k MP3
							2410,		// Dubstep.fm - 256k MP3
							4055,		// UFO TRAP Radio Station
							885			// Dubstep) (Uturn Radio
			];

			dubPlaylist.tracks           	= [
							55,			// Dub & Bass
							2599,		// Walmer Radio
							2392,		// LanochedelhombrelobO - Dubfun - mp3 128kbs
							6431,		// LanochedelhombrelobO - Dubfun - ogg 112 kbs
							6416,		// Cyprus Dub Community Radio
							145, 		// Urban Boogie
							7631,		// Arctic Dub (Sursumcorda)
							7656, 		// Anima Amoris [Dub Techno] 56 AACP anima.sknt.ru
							7657 		// Anima Amoris [Dub Techno] 320 MP anima.sknt.ru
			];

			nirvanaPlaylist.currentTrack 	= {
					id 				: 1330,
					url 			:'http://graalradio.com:8123/future',
					title 			:'Graal Radio Future'
					// scrollPosition 	: 0
			};

			dubstepPlaylist.currentTrack 	= {
					id 				: 2599,
					url 			:'http://sc3.dubplate.fm:8200/lofi_autodj',
					title 			:'Walmer Radio'
					// scrollPosition - ???
			};

			dubPlaylist.currentTrack     	= {
					id 				: 55,
					url 			:'http://sc3.dubplate.fm:5000/dubstep/192',
					title 			:'Dub & Bass'
			};

			__playlists['~Nirvana~']       	= nirvanaPlaylist;
			__playlists['Dubstep']       	= dubstepPlaylist;
			__playlists['|_Dub_|']           	= dubPlaylist;

			playerState.currentPlaylist = '~Nirvana~';
			
			playerState.volume = .27;
			playerState.paused = true;
		}
	},
	created () {
		
	}
});
