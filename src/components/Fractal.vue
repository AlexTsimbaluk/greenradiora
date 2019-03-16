<template>
	<div class="canvas-wrapper">
		<canvas id="visEqLeft" class=""></canvas>
	</div>
</template>

<script>
	import Vue from 'vue';


	import PlayerData from '@/PlayerData.js';
	import PlayerState from '@/PlayerState.js';
	import PlayerAudio from '@/PlayerAudio.js';
	
	// import Rx from 'rxjs/Rx';
	// import { of } from 'rxjs';


	export default {
		name: 'Fractal',
		data () {
			return {
				// аудиоконтекст
				audioCtx: null,
				// источник звука для аудиоконтекста
				source: null,
				analyserEq: null,

				canvas: null,
				_q: 1,
				bW: 1,

				animationState: '',

				sub: null
			}
		},
		// TODO: разделить каналы - https://dzone.com/articles/exploring-html5-web-audio
		methods: {
			/*init () {
				console.log('');
				console.log('# Fractal::init');
				
				console.log(this.audioCtx.state);

				if(this.audioCtx.state.toLowerCase() != 'running') {
					this.audioCtx = new window.AudioContext;
				}

				let initRepeat = () => {
					if(this.audioCtx.state.toLowerCase() != 'running') {
						console.log('!!! AudioContext is not running');
						setTimeout(() => {
							this.init();
						}, 200)
					}
				};

				this.audioCtx.resume().then(() => {
					console.log('+++ Fractal::audiocontext is running successfully');

					console.log(this.audioCtx.state);
					this.source = this.audioCtx.createMediaElementSource(PlayerState.playerTag);
					
					this.initCanvas();

					let analyserEq = new this.Analyser(
						'eq',
						this.audioCtx,
						this.source,
						this.drawEq,	
						{smoothingTimeConstant: 0.4, fftSize: 1024},
						'equalizer'
						// 'graphic_eq'
					);
				}).catch(() => {
					console.log(this.audioCtx.state);
					initRepeat();
				}).finally(() => {
					console.log(this.audioCtx.state);
					initRepeat();
					// this.audioCtx.resume();
				});
			},*/
			init () {
				console.log('');
				console.log('# Fractal::init');
				
				/*console.log(this.audioCtx.state);

				if(this.audioCtx.state.toLowerCase() != 'running') {
					this.audioCtx = new window.AudioContext;
				}

				let initRepeat = () => {
					if(this.audioCtx.state.toLowerCase() != 'running') {
						console.log('!!! AudioContext is not running');
						setTimeout(() => {
							this.init();
						}, 200)
					}
				};*/

				this.audioCtx = new window.AudioContext;

				this.audioCtx.resume().then(() => {
					console.log('+++ Fractal::audiocontext is running successfully');

					console.log(this.audioCtx.state);
					this.source = this.audioCtx.createMediaElementSource(PlayerState.playerTag);
					
					this.initCanvas();

					let analyserEq = new this.Analyser(
						'eq',
						this.audioCtx,
						this.source,
						this.drawEq,	
						{smoothingTimeConstant: 0.4, fftSize: 1024},
						'equalizer'
						// 'graphic_eq'
					);
				}).catch(() => {
					console.log(this.audioCtx.state);
					// initRepeat();
				}).finally(() => {
					console.log(this.audioCtx.state);
					// initRepeat();
					// this.audioCtx.resume();
				});
			},
			Analyser (name, audioCtx, src, drawCb, analyserOpts, icon) {
				let animationFrame = null;

			    this.running = false;
				this.name = name;
				this.icon = icon;
			    this.analyser = audioCtx.createAnalyser();

		    	this.analyser.smoothingTimeConstant = analyserOpts.smoothingTimeConstant || 0.7;
		    	this.analyser.fftSize = analyserOpts.fftSize || 512;

		    	src.connect(this.analyser);
		    	this.analyser.connect(audioCtx.destination);

			    let streamData = new Uint8Array(this.analyser.frequencyBinCount);


		        this.start = () => {
		        	if(!this.running) {
		        		this.running = true;
		        	}

		            this.analyser.getByteFrequencyData(streamData);
		            drawCb(streamData);
		            animationFrame = requestAnimationFrame(this.start);
		        }

		        this.stop = () => {
		        	// console.log('@@@ Fractal:animation:stop');

	        		this.running = false;
				    streamData = new Uint8Array(this.analyser.frequencyBinCount);
		            drawCb(streamData, true);
		        	cancelAnimationFrame(animationFrame);
		        }

		        PlayerState.createAnimations(this);
			},

			initCanvas () {
				this.canvas = new this.AudioCanvas('visEqLeft', document.documentElement.clientWidth, document.documentElement.clientHeight - 10);
				this._q = +((this.canvas.canvasHeight / 2 / 255).toFixed(2));				
			},

			// Возвращает объект контекста для canvas и его размеры
			// Принимает DOM-элемент и размеры
			AudioCanvas(id, width, height) {
				let canvas = document.getElementById(id);

				canvas.width 		= width;
				canvas.height 		= height;
				this.ctx			= canvas.getContext("2d");
				this.canvasWidth 	= canvas.width;
				this.canvasHeight 	= canvas.height;
			},
			drawEq (streamData, stop) {
				this.canvas.ctx.clearRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);
				
				if(stop) {
					return false;
				}

			    for(let bin = 0; streamData && bin < streamData.length; bin ++) {
			        let val = streamData[bin];

			        // this.canvas.ctx.fillStyle = 'rgb(' + (val) + ',' + (val) + ',' + (val) + ')';
			        this.canvas.ctx.fillStyle = 'rgb(' + (val) + ',' + (255 - val) + ',' + (255) + ')';
			        // this.canvas.ctx.fillStyle = 'rgb(' + (255 - val) + ',' + (val) + ',' + (255 - val) + ')';

			        this.canvas.ctx.fillRect(bin, (this.canvas.canvasHeight / 2) - (val * this._q), this.bW, Math.floor(val * this._q * 2));
			        this.canvas.ctx.fillRect(this.canvas.canvasWidth - bin, (this.canvas.canvasHeight / 2) - (val * this._q), this.bW, Math.floor(val * this._q * 2));
			    }
			},
			/*drawFractal () {
				var canvas = new AudioCanvas('visFractal', 500, 255 * 2);
				canvas.ctx.clearRect(0, 0, canvas.canvasWidth, canvas.canvasHeight);

				var qtMin = 5;
				var fib =  	1.6180339;

			    for(var bin = 0; bin < audioApiElement.streamData_4.length; bin ++) {
			        var val = audioApiElement.streamData_4[bin];
			        // canvas.ctx.fillStyle = 'rgb(' + (val) + ',' + (val) + ',' + (val) + ')';
			        // canvas.ctx.fillRect(bin, canvas.canvasHeight / 2 + 1, 1, Math.floor(-val / 1.5));
			        // canvas.ctx.fillRect(bin, canvas.canvasHeight / 2 - 1, 1, Math.floor(val / 1.5));
		        	if (qt <= qtMin) {
		        		canvas.ctx.stroke();
		        	} else {
		        		for (var i = 0; i < qt; i++) {
		        			canvas.ctx.arc(bin * bin * fib, 3 * bin, fib * bin, 0, 2 * Math.PI);
							canvas.ctx.rotate(2 * Math.PI * 3 / (qt - 1));
		        		}
		        		drawRound(qt * 0.5);
		          	}
			    }
			    requestAnimationFrame(drawFractal);
			},
			drawWolumeBar () {
				// var volumeAnimation 	= requestAnimationFrame(drawWolumeBar());
				// q - какую часть volume-bar от 100% отрисовать, от 1 до 10, шаг - 10%
				var q = Math.ceil(+($('#player .volume input').val()) / 10);

				ctxVolume.clearRect(0, 0, canvasVolumeWidth, canvasVolumeHeight);
				var maxHue 			= 360 / 10 * q,
					startHue		= 0,
					barWidth 		= 3,
					gutterWidth		= 1,
					maxBar			= Math.floor(canvasVolumeWidth / (gutterWidth + barWidth)),
					targetCountBar	= Math.floor(maxBar / 10 * q),
					barMaxHeight	= canvasVolumeHeight,
					barStepHeight	= (barMaxHeight / maxBar)
				;
				// console.log(maxBar);

				for (var i = 0; i < targetCountBar; i++) {
					ctxVolume.fillStyle = 'hsl(' + i * maxHue / targetCountBar + ', 100%, 50%)';
					ctxVolume.fillRect(i * (gutterWidth + barWidth), canvasVolumeHeight - i * barStepHeight - barStepHeight, barWidth, i * barStepHeight + barStepHeight);
					
					ctxVolume.fill();
				}
				// ctxVolume.fillRect(10 * (gutterWidth + barWidth), canvasVolumeHeight - 10 * barStepHeight - barStepHeight, barWidth, 10 * barStepHeight + barStepHeight);
				// ctxVolume.fill();

				startHue += 15 % 360;
				// console.log(startHue);
			}*/
		},
		created () {
			console.log('@@@ Fractal:hook:created');


			PlayerData.$on('dataTransfer', () => {
				/*this.audioCtx = new window.AudioContext;
				console.log(this.audioCtx.state);
				setTimeout(() => {
					// (this.audioCtx.state == 'suspended') && (this.audioCtx = new window.AudioContext);
					console.log(this.audioCtx.state);
					this.init();
				}, 100);*/
				
				this.init();
			});

			PlayerState.$on('stateChanged', (state) => {
				// this.animationState = state.animationState;
			});



			// this.bW = (document.documentElement.clientWidth > 511) ?  +(document.documentElement.clientWidth / 512).toFixed(1) : 1;


			/*this.sub = PlayerState.sub$.subscribe(
				(val) => {
					console.log(val);
					// console.log(PlayerState.playerTag);
				},
				(err) => console.error('error:', err),
				() => console.log('completed')
			);*/

			// of(PlayerState.playerState).subscribe(
			/*PlayerState.stateChangedPromise.subscribe(
				(state) => {
					console.log('');
					console.log('PlayerState changed');
					console.log(state);
					// console.log(PlayerState.playerTag);
				},
				(err) => console.error('error:', err),
				() => console.log('Completed')
			);*/

			/*this.sub = fromPromise(PlayerState.stateChanged()).subscribe(
				(val) => {
					console.log('');
					console.log('+ From fractal sub');
					console.log(val);
					// console.log(PlayerState.playerTag);
				},
				(err) => console.error('error:', err),
				() => console.log('completed')
			);*/

			// const subscribe = PlayerState.promiseSource.subscribe(val => console.log(val));
		}
	}
</script>

<style>
	.canvas-wrapper {
		position: absolute;
		z-index: -1;
	}
</style>