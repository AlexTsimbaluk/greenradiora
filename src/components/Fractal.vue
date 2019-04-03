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
				maxHeight: document.documentElement.clientHeight - 10,

				// для отладки, вывести в консоль что-то один раз в requestAnimationFrame
				one: false,

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
						{smoothingTimeConstant: 0.9, fftSize: 32},
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

		            drawCb(streamData, false);
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
				this.canvas = new this.AudioCanvas('visEqLeft', this.maxWidth, this.maxHeight);
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

			// получим суммарный уровень частот в момент времени
			getTotal(data) {
				return data.reduce((sum, current) => {
					return sum + current;
				}, 0);
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
				this.canvas.ctx.clearRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);

				// const MAX_SIZE = 
				
				if(stop) {
					return false;
				}

				let fib = 1.6180339;

				let cX = this.canvas.canvasWidth / 2;
				let cY = this.canvas.canvasHeight / 2;

				// всего полосок
				let totalBands = streamData.length;
				let maxTotal = totalBands * 255;

	            let total = this.getTotal(streamData);

				let maxTotalShapeSize = Math.min(this.maxHeight, this.maxWidth) / 2;
				let ratio = Math.floor(maxTotal / maxTotalShapeSize);
				let totalShapeSize = Math.floor(total / ratio);

				let colorRatio = +(totalBands / 360).toFixed(3);
				let hue = Math.floor(total / colorRatio);
				let levelNumber = Math.floor(total / 255);
				let color = `hsla(${hue}, 100%, 50%, 0.5)`;

				this.canvas.ctx.save();
				this.canvas.ctx.translate(cX, cY);


				let gradient = this.canvas.ctx.createLinearGradient(-50, 0, -50, 50, 0);

				let gradientRad = this.canvas.ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(this.maxHeight / 2, this.maxWidth / 2));
				let gradientRad2 = this.canvas.ctx.createRadialGradient(0, 0, 0, 0, 0, total % maxTotalShapeSize);


				this.canvas.ctx.globalCompositeOperation = 'darken';
				// this.canvas.ctx.globalCompositeOperation = 'lighten';
				// this.canvas.ctx.globalCompositeOperation = 'lighter';
				// this.canvas.ctx.globalCompositeOperation = 'multiply';
				// this.canvas.ctx.globalCompositeOperation = 'overlay';

				/*gradientRad.addColorStop(0, 'rgba(255, 0, 255, 0.8)');
				gradientRad.addColorStop(1, 'rgba(0, 255, 0, 0.5)');

				gradientRad2.addColorStop(0, 'rgba(0, 255, 255, 0.1)'); 
				gradientRad2.addColorStop(1, 'rgba(255, 255, 0, 0.7)');*/

				// gradientRad.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.8)`);
				// gradientRad.addColorStop(1, `hsla(${hue - 360}, 100%, 50%, 0.5)`);

				// gradientRad2.addColorStop(0, `hsla(${360 - hue}, 100%, 50%, 0.1)`); 
				// gradientRad2.addColorStop(1, `hsla(${hue}, 100%, 50%, 0.7)`);

				let startTotalShapeSize = 10;

				for(let i = 0, startSize = totalShapeSize / 10; i < totalBands; i++) {
					let pos = +(i / totalBands).toFixed(2);
					let hue = (((i % 2 == 0) ? 300 : 120) + Math.ceil(360 / 16 * i)) % 360;

					gradientRad.addColorStop(pos, `hsla(${(hue) % 360}, 100%, 50%, ${pos})`);
					gradientRad2.addColorStop(pos, `hsla(${Math.abs((45 + hue) % 360)}, 100%, 50%, ${1 - pos})`);

					// let _r = !(!!(i % 3)) ? (i % 3) : 1.5;

					this.canvas.ctx.fillStyle = gradientRad;
	    			// this.canvas.ctx.fillRect(-totalShapeSize, -totalShapeSize, totalShapeSize * 2, totalShapeSize * 2);
	    			this.canvas.ctx.fillRect(-totalShapeSize / 2, -totalShapeSize / 2, totalShapeSize, totalShapeSize);
					
					// this.canvas.ctx.rotate(Math.PI / totalBands);
					this.canvas.ctx.rotate(this.toRad(Utils.round(360 / totalBands * 3)));

					this.canvas.ctx.fillStyle = gradientRad2;
	    			// this.canvas.ctx.fillRect(-totalShapeSize, -totalShapeSize, totalShapeSize * 2, totalShapeSize * 2);
	    			this.canvas.ctx.fillRect(-totalShapeSize / 2, -totalShapeSize / 2, totalShapeSize, totalShapeSize);	    			
				}

				// this.canvas.ctx.rotate(this.toRad(Utils.round(360 / 36)));

				/*let firstX = 100, firstY = 150, secondX = 250, secondY = 50, endingX = 0, endingY = 100;
				this.canvas.ctx.bezierCurveTo( firstX, firstY, secondX, secondY, endingX, endingY );*/

				let rgbColor = Math.floor(total / totalBands);
				rgbColor = (rgbColor * (total % 4)) % 360;

				this.canvas.ctx.globalCompositeOperation = 'lighter';
				
				let gradRad = this.canvas.ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(this.maxHeight / 2, this.maxWidth / 2));
				let gradRad2 = this.canvas.ctx.createRadialGradient(0, 0, 0, 0, 0, total % maxTotalShapeSize);

				gradRad.addColorStop(0, 'rgba(' + (255 - rgbColor) + ', 0, 255, 0.5)'); 
				gradRad.addColorStop(1, 'rgba(' + rgbColor + ', 0, ' + (255 - rgbColor) + ', 0.3)');

				gradRad2.addColorStop(0, 'rgba(0, ' + rgbColor + ', 255, 0.3)'); 
				gradRad2.addColorStop(1, 'rgba(' + rgbColor + ', ' + (255 - rgbColor) + ', 0, 0.4)');

				this.canvas.ctx.fillStyle = gradRad;
    			// this.canvas.ctx.fillRect(-totalShapeSize * 1.5, -totalShapeSize * 1.5, totalShapeSize * 2 * 1.5, totalShapeSize * 2 * 1.5);
    			this.canvas.ctx.fillRect(-totalShapeSize, -totalShapeSize, totalShapeSize * 2, totalShapeSize * 2);
				
				rgbColor = (rgbColor * (total % 8)) % 360;
				this.canvas.ctx.rotate(Math.PI / 3);

				this.canvas.ctx.fillStyle = gradRad2;
    			// this.canvas.ctx.fillRect(-totalShapeSize * 1.5, -totalShapeSize * 1.5, totalShapeSize * 2 * 1.5, totalShapeSize * 2 * 1.5);
    			this.canvas.ctx.fillRect(-totalShapeSize, -totalShapeSize, totalShapeSize * 2, totalShapeSize * 2);
    			
				rgbColor = (rgbColor * (total % 11)) % 360;
				gradRad.addColorStop(0, 'rgba(' + (rgbColor) + ', 0, ' + (255 - rgbColor) + ', 0.3)'); 
				gradRad.addColorStop(1, 'rgba(' + 0 + ', 255, ' + (255 - rgbColor) + ', 0.3)');
    			this.canvas.ctx.rotate(Math.PI / 3);
    			this.canvas.ctx.fillStyle = gradRad;
    			this.canvas.ctx.fillRect(-totalShapeSize, -totalShapeSize, totalShapeSize * 2, totalShapeSize * 2);

    			// this.canvas.ctx.arc(0, 0, totalShapeSize, 0, Math.PI * 2);
    			// this.canvas.ctx.fill();

			    for(let bin = 0, qt = totalBands * 3; streamData && bin < qt; bin ++) {
			    	let val = streamData[bin];

			    	/*if(!this.one) {
						console.log(totalBands);
						this.one = false;
					}*/

			    	if (bin % 2 == 0) {
		    			// this.canvas.ctx.strokeStyle = "rgb(255," + Math.floor(255 - 255 / qt * bin) + "," + Math.floor(0 + 255 / qt * bin) + ")";
		    			this.canvas.ctx.strokeStyle = 'rgb(255,' + Math.floor(val) + ',' + Math.floor(val) + ')';
		    		} else {
		    			this.canvas.ctx.strokeStyle = 'rgb(0,' + Math.floor(255 - 255 / qt * bin) + ',' + Math.floor(0 + 255 / qt * bin) + ')';
		    			// this.canvas.ctx.strokeStyle = "rgb(0," + Math.floor(255 - val) + "," + Math.floor(0 + 255 / qt * bin) + ")";
		    		}

		    		// let stopColorPos = +(Math.floor(1 / qt).toFixed(2));
		    		let stopColorPos = +((1 / qt).toFixed(2));
	    			// gradient.addColorStop(stopColorPos, 'rgb(255,' + (255 - val) + ',' + (255 - val) + ')');
	    			// gradient.addColorStop(stopColorPos, 'rgb(' + val + ',' + Math.floor(255 - 255 / qt * bin) + ',' + Math.floor(0 + 255 / qt * bin) + ')');
	    			// gradient.addColorStop(stopColorPos, `rgb(${val}, ${Math.floor(255 - 255 / qt * bin)}, ${Math.floor(255 / qt * bin)})`);

		    		/*if(bin == 0) {
						gradient.addColorStop(0, 'rgb(255,' + val + ',' + 0 + ')');
						gradient.addColorStop(0.5, 'rgb(255,' + (255 - val) + ',' + val + ')');
						gradient.addColorStop(1, 'rgb(255,' + (255 - val) + ',' + (255 - val) + ')'); 
						  
						this.canvas.ctx.fillStyle = gradient;
		    			this.canvas.ctx.fillRect(Math.round(-val / 2), Math.round(-val / 2), val * 2, val * 2);
		    			
		    			// this.canvas.ctx.arc(0, 0, val, 0, Math.PI * 2);
		    			// this.canvas.ctx.fill();


		    			// this.canvas.ctx.arc(0, 0, total / 30, 0, Math.PI * 2);
			    		// this.canvas.ctx.clearRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);
		    		}*/
			    	
			    	if(bin < 4) {
			    		// this.canvas.ctx.strokeRect(Math.round(100 * 1), Math.round(-100 * 1), val, val);
			    		val /= 4;
			    		this.canvas.ctx.strokeStyle = "rgb(255," + Math.floor(255 - val) + "," + Math.floor(val) + ")";
			    	} else if(bin < 7) {
			    		// this.canvas.ctx.strokeRect(Math.round(100 * 1), Math.round(-100 * 1), val, val);
			    		// val /= 4;
			    		this.canvas.ctx.strokeStyle = "rgb(255," + Math.floor(255 - val) + "," + Math.floor(val) + ")";
			    	} else if(bin < 13) {

			    		// val *= 2;
			    	} else if(bin < 19) {
			    		// val *= 2;
			    	} else if(bin < 25) {
			    		// val *= 2;
			    	} else if(bin >= 25) {
			    		// val *= 2;
			    	}

			    	this.canvas.ctx.fillStyle = gradient;
			    	// this.canvas.ctx.strokeStyle = gradient;

		    		this.canvas.ctx.strokeRect(Math.round(-val / 2), Math.round(-val / 2), val, val);
		    		// this.canvas.ctx.fillRect(Math.round(-val / 2), Math.round(-val / 2), val / 2, val / 2);


		    		// this.canvas.ctx.strokeRect(Math.round(val * 2), Math.round(-val * 2), val, val);

		    		// this.canvas.ctx.arc(0, 0, Math.round(val), 0, Math.PI * 2);

		    		if(false && bin == 0) {
						gradient.addColorStop(0, 'rgb(0,' + val + ',' + 0 + ')');
						// gradient.addColorStop(0.5, 'rgb(255,' + (255 - val) + ',' + val + ')');
						gradient.addColorStop(1, 'rgb(0,' + (255 - val) + ',' + (255 - val) + ')'); 
						  
						this.canvas.ctx.fillStyle = gradient;
		    			this.canvas.ctx.fillRect(Math.round(-val / 2), Math.round(-val / 2), val * 2, val * 2);
		    			
		    			// this.canvas.ctx.arc(0, 0, val, 0, Math.PI * 2);
		    			// this.canvas.ctx.fill();


		    			// this.canvas.ctx.arc(0, 0, total / 30, 0, Math.PI * 2);
			    		// this.canvas.ctx.clearRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);
		    		}
		    		
		    		
		    		
		    		this.canvas.ctx.stroke();
		    		this.canvas.ctx.rotate(2 * Math.PI * 3 / (qt - 1));
		    		this.canvas.ctx.rotate(2 * Math.PI * 4 / (qt - 1));
			    }

			    this.canvas.ctx.restore();
			},
			draw (streamData, stop) {
				this.canvas.ctx.clearRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);
				
				if(stop) {
					return false;
				}

			    for(let bin = 0; streamData && bin < streamData.length; bin ++) {
			        
			    }
			},
			toRad (degree) {
				return degree * Math.PI / 180;
			}
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