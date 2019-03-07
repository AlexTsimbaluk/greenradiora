import Vue from 'vue';

import PlayerData from '@/PlayerData.js';
import PlayerState from '@/PlayerState.js';

export default new Vue({
	data () {
		return {
			// аудиоконтекст
			audioCtx: null,
			// источник звука для аудиоконтекста
			source: null,
			analyserEqLeft: null,
			streamDataEqLeft: null
		}
	},
	methods: {
		init (playerTag) {
			this.source = this.audioCtx.createMediaElementSource(PlayerState.playerTag);

			this.analyserEqLeft = new this.Analyser(this.audioCtx, this.source, {smoothingTimeConstant: 0.4, fftSize: 1024}, this);
			
			this.$emit('eqLeftCanvas');
			// this.$emit('streamDataEqLeft', this.analyserEqLeft);

			this.analyserEqLeft.update();
		},
		// объект, который запускает и останавливает  функцию отрисовки звуковых данных из streamdata
		/*drawSound () {
			var self = this;
			var interval;

			self.getCtx = function(canvasId, width, height) {
				var canvas = new AudioCanvas(canvasId, width, height);
			}

			this.start = function(cb) {
				interval = requestAnimationFrame(cb);
			}
			this.stop = function(cb) {
				clearRequestAnimationFrame(cb);
			}
		},*/
		// http://ianreah.com/2013/02/28/Real-time-analysis-of-streaming-audio-data-with-Web-Audio-API.html
		// https://dzone.com/articles/exploring-html5-web-audio - разделить каналы
		Analyser (audioCtx, src, analyserOpts, ctx) {
		    this.analyser = audioCtx.createAnalyser();

	    	this.analyser.smoothingTimeConstant =
	    									analyserOpts.smoothingTimeConstant ||
								    		0.7;
	    	this.analyser.fftSize = analyserOpts.fftSize || 512;

	    	src.connect(this.analyser);
	    	this.analyser.connect(audioCtx.destination);

		    this.streamData = new Uint8Array(this.analyser.frequencyBinCount);

	        this.update = () => {
	        	console.log('update');
	            // requestAnimationFrame(this.update);

	            ctx.$emit('streamDataEqLeft', this.analyser);
	        }
	            // this.analyser.getByteFrequencyData(this.streamData);
	            // ctx.$emit('streamDataEqLeft', this.streamData);
	            console.log(this.streamData);
		},
		enableAnimation (visName) {
			this.streamDataEqLeft = analyserEqLeft.streamData;// this - AudioApiElement
		    drawEqLeft();
		},
		disableAnimation (visName) {
			this.streamDataEqLeft = null;
		    drawEqLeft();
		}

	},
	created () {
		console.log('@@@ PlayerAudio:hook:created');

		this.audioCtx = new window.AudioContext;
	}
});