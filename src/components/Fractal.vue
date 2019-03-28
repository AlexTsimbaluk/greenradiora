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

	import Utils from '@/Utils.js';
	
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

				canvas: null,
				_q: 1,
				bW: 1,

				maxWidth: document.documentElement.clientWidth,

				animationState: '',

				sub: null
			}
		},
		// TODO: разделить каналы - https://dzone.com/articles/exploring-html5-web-audio
		methods: {
			init (reinit) {
				!reinit && Utils.logs('# Fractal::init');

				this.audioCtx = new AudioContext;

				Utils.logs('audioContext state is ' + this.audioCtx.state);

				if(this.audioCtx.state == 'suspended') {
					this.audioCtx = null;

					setTimeout(() => {
						this.init(true);
					}, 500);

					return false;
				}

				this.audioCtx.resume().then(() => {
					console.log('+++ Fractal::audiocontext is running successfully');

					console.log(this.audioCtx.state);
					this.source = this.audioCtx.createMediaElementSource(PlayerState.playerTag);
					
					this.initCanvas();
				
					/*let cX = this.canvas.canvasWidth / 2;
					let cY = this.canvas.canvasHeight / 2;

					this.canvas.ctx.translate(cX, cY);

				    for(let bin = 0, qt = 128; bin < qt; bin ++) {

			    		this.canvas.ctx.strokeRect(0, 0, 100, 100);
			    		
			    		if (bin % 2 == 0) {
			    			this.canvas.ctx.strokeStyle = "rgb(255," + Math.floor(255 - 255 / qt * bin) + "," + Math.floor(0 + 255 / qt * bin) + ")";
			    		} else {
			    			this.canvas.ctx.strokeStyle = "rgb(0," + Math.floor(255 - 255 / qt * bin) + "," + Math.floor(0 + 255 / qt * bin) + ")";
			    		}
			    		
			    		this.canvas.ctx.stroke();
			    		this.canvas.ctx.rotate(2 * Math.PI * 4 / (qt - 1));
				    }*/

					let analyserEqFft = (this.maxWidth >= 512) ? 1024 : 512;

					let analyserEq = new this.Analyser(
						'eq',
						this.canvas,
						this.audioCtx,
						this.source,
						this.drawEq,	
						{smoothingTimeConstant: 0.4, fftSize: analyserEqFft},
						'equalizer'
						// 'graphic_eq'
					);

					let analyserFractal = new this.Analyser(
						'fractal',
						this.canvas,
						this.audioCtx,
						this.source,
						this.drawFractal,	
						{smoothingTimeConstant: 0.7, fftSize: 32},
						'brightness_auto'
					);
				}).catch(() => {
					console.log(this.audioCtx.state);
				}).finally(() => {
					console.log(this.audioCtx.state);
				});
			},
			Analyser (name, canvas, audioCtx, src, drawCb, analyserOpts, icon) {
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

		            canvas.ctx.clearRect(0, 0, canvas.canvasWidth, canvas.canvasHeight);
		            
		            canvas.ctx.save();
		            drawCb(streamData);
		            canvas.ctx.restore();
		            animationFrame = requestAnimationFrame(this.start);
		        }

		        this.stop = () => {
	        		this.running = false;
				    streamData = new Uint8Array(this.analyser.frequencyBinCount);
		            drawCb(streamData, true);
		        	cancelAnimationFrame(animationFrame);
		        }

		        PlayerState.createAnimations(this);
			},

			initCanvas () {
				this.canvas = new this.AudioCanvas('visEqLeft', this.maxWidth, document.documentElement.clientHeight - 10);
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
			drawFractal (streamData, stop) {				
				// this.canvas.ctx.clearRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);
				
				if(stop) {
					return false;
				}

				// let fib = 1.6180339;

				let cX = this.canvas.canvasWidth / 2;
				let cY = this.canvas.canvasHeight / 2;

				this.canvas.ctx.translate(cX, cY);
				// this.canvas.ctx.transform(1, 0, 0, 1, cX, cY);

			    for(let bin = 0, qt = 8; streamData && bin < qt; bin ++) {
			    	let val = streamData[bin];

		    		this.canvas.ctx.strokeRect(0, 0, 100, 100);

		    		// this.canvas.ctx.moveTo(streamData[bin],streamData[bin]);
		    		// this.canvas.ctx.lineTo(streamData[bin] % 5,streamData[bin] / 1.618);
		    		// this.canvas.ctx.lineTo(streamData[bin] / 1.618,streamData[bin]);
		    		// this.canvas.ctx.lineTo(streamData[bin],streamData[bin]);
		    		
		    		if (bin % 2 == 0) {
		    			this.canvas.ctx.strokeStyle = "rgb(255," + Math.floor(255 - 255 / qt * bin) + "," + Math.floor(0 + 255 / qt * bin) + ")";
		    		} else {
		    			this.canvas.ctx.strokeStyle = "rgb(0," + Math.floor(255 - 255 / qt * bin) + "," + Math.floor(0 + 255 / qt * bin) + ")";
		    		}
		    		
		    		this.canvas.ctx.stroke();
		    		this.canvas.ctx.rotate(2 * Math.PI * 4 / (qt - 1));
			    }

			    // this.canvas.ctx.clearRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);
			    // this.canvas.ctx.translate(0, 0);
			    // this.canvas.ctx.restore();
			},
			draw (streamData, stop) {
				this.canvas.ctx.clearRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);
				
				if(stop) {
					return false;
				}

			    for(let bin = 0; streamData && bin < streamData.length; bin ++) {
			        
			    }
			},
			/*drawTriangle () {
				canvas.ctx.translate(canvas.canvasWidth / 2, canvas.canvasHeight / 2);
				canvas.ctx.clearRect(0, 0, canvas.canvasWidth, canvas.canvasHeight);

				var fib =  	1.6180339;

				// при fftSize > 64 тормозит
			    for(var bin = 0; audioApiElement.streamDataTriangle && bin < audioApiElement.streamDataTriangle.length; bin ++) {
			        // var val = audioApiElement.streamDataTriangle[bin] % 50;
			        if(bin % 6 == 0) {
			        	continue;
			        }
			        var val = audioApiElement.streamDataTriangle[bin] % 7;

			        // canvas.ctx.strokeStyle = 'rgb(' + (val) + ',' + (val) + ',' + (val) + ')';
			        canvas.ctx.strokeStyle = 'rgb(255, 255, 255)';
			        

			        if (bin % 2 == 0) {
			        	canvas.ctx.strokeStyle = "rgb(" + Math.floor(255 - 255 / val * bin) + "0," + Math.floor(255 - 255 / val * bin) + ")";
			        } else if (bin % 3 == 0) { 
			        	canvas.ctx.strokeStyle = "rgb(0," + Math.floor(0 + 255 / val * bin) + "," + Math.floor(0 + 255 / val * bin) + ")";
			        } else { 
			        	canvas.ctx.strokeStyle = "rgba(" + Math.floor(255 - 255 / val * bin) + "," + Math.floor(0 + 255 / val * bin) + "," + Math.floor(255 - 255 / val * bin) + ".5)";
			        }

			        canvas.ctx.moveTo(audioApiElement.streamDataTriangle[bin],audioApiElement.streamDataTriangle[bin]);
			        canvas.ctx.lineTo(audioApiElement.streamDataTriangle[bin] % 5,audioApiElement.streamDataTriangle[bin] / 1.618);
			        canvas.ctx.lineTo(audioApiElement.streamDataTriangle[bin] / 1.618,audioApiElement.streamDataTriangle[bin]);
			        canvas.ctx.lineTo(audioApiElement.streamDataTriangle[bin],audioApiElement.streamDataTriangle[bin]);

			        // canvas.ctx.moveTo(240, val * 1.7);
			        // canvas.ctx.lineTo(val * 1.7, val * 3);
			        // canvas.ctx.lineTo(val * 3, val * 1.7);
			        // canvas.ctx.lineTo(240, val * 1.7);

			        
			        canvas.ctx.stroke();
			        canvas.ctx.strokeRect(0, 0, audioApiElement.streamDataTriangle[bin], audioApiElement.streamDataTriangle[bin]);
			        // canvas.ctx.strokeRect(0, 0, val, 45);

			        canvas.ctx.rotate(4 * Math.PI);
			        canvas.ctx.rotate(Math.PI * 3 / 60);
			        canvas.ctx.rotate(2 * Math.PI);
			        canvas.ctx.rotate(Math.PI / 4 );
			    	
			    }
			    requestAnimationFrame(drawTriangle);
			},*/
			/*drawFractal () {
				var canvas = new AudioCanvas('visFractal', 500, 255 * 2);
				canvas.ctx.clearRect(0, 0, canvas.canvasWidth, canvas.canvasHeight);

				var qtMin = 5;
				var fib =  	1.6180339;

			    for(var bin = 0; bin < audioApiElement.streamData_4.length; bin ++) {
			        var val = audioApiElement.streamData_4[bin];
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
				
				this.init(false);
			});

			/*PlayerState.$on('stateChanged', (state) => {
				
			});*/



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