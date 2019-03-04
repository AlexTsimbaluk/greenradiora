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


	export default {
		name: 'Fractal',
		data () {
			return {
				canvas: null,
				analyserEqLeft: null,
				streamDataEqLeft: null,
				_q: 1,
				bW: 1
			}
		},
		methods: {
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
			__drawEqLeft (_streamData) {
				let streamData = 0;
				streamData = Math.round(_streamData);
				// console.log(Math.round(_streamData));
				// console.log(streamData);
				let maxValue = (window.innerHeight > 510) ? 510 : (Math.ceil(window.innerHeight / 2));
				// получаем canvas
				// let canvas = new AudioCanvas('visEqLeft', 500, 255 * 2);
				let canvas = new this.AudioCanvas('visEqLeft', window.innerWidth, maxValue * 2);
				canvas.ctx.clearRect(0, 0, canvas.canvasWidth, canvas.canvasHeight);

			    for(let bin = 0; streamData && bin < streamData.length; bin ++) {
			        let val = streamData[bin];
			        canvas.ctx.fillStyle = 'rgb(' + (val) + ',' + (val) + ',' + (val) + ')';
			        canvas.ctx.fillRect(bin, canvas.canvasHeight / 2 + 1, 1, Math.floor(-val / 1.5));
			        canvas.ctx.fillRect(bin, canvas.canvasHeight / 2 - 1, 1, Math.floor(val / 1.5));
			    }
			    requestAnimationFrame(this.drawEqLeft);
			},
			drawEqLeft (streamData) {
				this.canvas.ctx.clearRect(0, 0, this.canvas.canvasWidth, this.canvas.canvasHeight);

				// this.analyser.getByteFrequencyData(this.streamData);
				// ctx.$emit('streamDataEqLeft', this.streamData);

			    for(let bin = 0; streamData && bin < streamData.length; bin ++) {
			        let val = streamData[bin];

			        // this.canvas.ctx.fillStyle = 'rgb(' + (val) + ',' + (val) + ',' + (val) + ')';
			        this.canvas.ctx.fillStyle = 'rgb(' + (val) + ',' + (255 - val) + ',' + (255) + ')';
			        // this.canvas.ctx.fillStyle = 'rgb(' + (255 - val) + ',' + (val) + ',' + (255 - val) + ')';

			        this.canvas.ctx.fillRect(bin, (this.canvas.canvasHeight / 2) - (val * this._q), this.bW, Math.floor(val * this._q * 2));
			        this.canvas.ctx.fillRect(this.canvas.canvasWidth - bin, (this.canvas.canvasHeight / 2) - (val * this._q), this.bW, Math.floor(val * this._q * 2));
			        // this.canvas.ctx.fillRect(bin, this.canvas.canvasHeight / 2 - 1, 1, Math.floor(val / 1.5));
			    }
			    // requestAnimationFrame(this.drawEqLeft(streamData));
			},
			drawFractal () {
				var canvas = new AudioCanvas('visFractal', 500, 255 * 2);
				canvas.ctx.clearRect(0, 0, canvas.canvasWidth, canvas.canvasHeight);

				var qtMin = 5;
				var fib =  	1.6180339;

			    for(var bin = 0; bin < audioApiElement.streamData_4.length; bin ++) {
			        var val = audioApiElement.streamData_4[bin];
			        /*canvas.ctx.fillStyle = 'rgb(' + (val) + ',' + (val) + ',' + (val) + ')';
			        canvas.ctx.fillRect(bin, canvas.canvasHeight / 2 + 1, 1, Math.floor(-val / 1.5));
			        canvas.ctx.fillRect(bin, canvas.canvasHeight / 2 - 1, 1, Math.floor(val / 1.5));*/
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
				/*ctxVolume.fillRect(10 * (gutterWidth + barWidth), canvasVolumeHeight - 10 * barStepHeight - barStepHeight, barWidth, 10 * barStepHeight + barStepHeight);
				ctxVolume.fill();*/

				startHue += 15 % 360;
				// console.log(startHue);
			}
		},
		created () {
			console.log('@@@ Fractal:hook:created');

			// this.bW = (document.documentElement.clientWidth > 511) ?  +(document.documentElement.clientWidth / 512).toFixed(1) : 1;
			
			PlayerAudio.$on('eqLeftCanvas', () => {
				this.canvas = new this.AudioCanvas('visEqLeft', document.documentElement.clientWidth, document.documentElement.clientHeight - 10);
				this._q = +((this.canvas.canvasHeight / 2 / 255).toFixed(2));
			});

			PlayerAudio.$on('streamDataEqLeft', (event) => {
				this.drawEqLeft(event);
			});
		}
	}
</script>

<style>
	.canvas-wrapper {
		position: absolute;
		z-index: -1;
	}
</style>