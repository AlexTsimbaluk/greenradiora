<template>
	<div class="loader">
		<div class="bounce1"></div>
		<div class="bounce2"></div>
		<div class="bounce3"></div>
	</div>
</template>

<script>
	export default {
		name: 'loader',
		data () {
			return {
				
			}
		}
	}
</script>

<style>
	.loader {
		margin: 0 auto;
		position: absolute;
		left: 50%;
		top: 188px;
		transform: translateX(-50%);
		z-index: 2;
	}

	.loader > div {
		width: 18px;
		height: 18px;
		background-color: #0ff;
		border-radius: 100%;
		box-shadow: 0 0 6px 4px #000 inset, 0 0 8px 5px #0ff;
		display: inline-block;
		animation: sk-bouncedelay 1.4s infinite ease-in-out both;
	}

	.loader .bounce1 {
		-webkit-animation-delay: -0.32s;
		animation-delay: -0.32s;
	}

	.loader .bounce2 {
		-webkit-animation-delay: -0.16s;
		animation-delay: -0.16s;
	}


	@keyframes sk-bouncedelay {
		0%, 80%, 100% { 
			transform: scale(0);
		}
		40% { 
			transform: scale(1.0);
		}
	}
</style>