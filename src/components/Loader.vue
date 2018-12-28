<!-- <div class="loader">
	<div class="bounce1"></div>
	<div class="bounce2"></div>
	<div class="bounce3"></div>
</div> -->
<template>
	<div class="loader-wrapper">

		<div class="loader-spiral">
			<div>
				<div>
					<div>
						<div>
							<div>
								<div>
									<div>
										<div>
											<div>
												<div></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
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

<style lang="less">
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
		background-color: @cyan;
		border-radius: 100%;
		box-shadow: 0 0 6px 4px #000 inset, 0 0 8px 5px @cyan;
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

	@cyan: #0ff;
	@purple: #9c27b0;
	@purple: rebeccapurple;
	@purple: purple;
	@green: #0f0;
	@blue: #00f;

	// https://codepen.io/Siddharth11/pen/xbGrpG
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
			border-top-color: @cyan;
		}
		50% {
			transform: rotate(180deg);
			border-top-color: @purple;
		}
		100% {
			transform: rotate(360deg);
			border-top-color: @cyan;
		}
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
			border-top-color: @cyan;
		}
		17% {
			transform: rotate(-180deg);
			border-top-color: @purple;
		}
		33% {
			transform: rotate(-360deg);
			border-top-color: @green;
		}
		50% {
			transform: rotate(180deg);
			border-top-color: @cyan;
		}
		66% {
			transform: rotate(360deg);
			border-top-color: @purple;
		}
		83% {
			transform: rotate(540deg);
			border-top-color: @green;
		}
		100% {
			transform: rotate(720deg);
			border-top-color: @cyan;
		}
		
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
			border-top-color: @cyan;
			opacity: 0;
		}
		1% {
			opacity: 0;
		}
		5% {
			opacity: 1;
		}
		25% {
			transform: rotate(-180deg);
			border-top-color: @green;
		}
		50% {
			transform: rotate(-360deg);
			border-top-color: @blue;
		}
		75% {
			transform: rotate(180deg);
			border-top-color: @purple;
		}
		95% {
			opacity: 1;
		}
		99% {
			opacity: 0;
		}
		100% {
			transform: rotate(360deg);
			border-top-color: @cyan;
			opacity: 0;
		}
		
	}

	.loader-wrapper {
		position: fixed;
		left: 50%;
		top: 180px;
		transform: translateX(-50%);
	}

	.loader-spiral {
		width: 150px;
		height: 150px;
		div {
			height: 100%;
		}
	}

	.loader-spiral,
	.loader-spiral div {
		animation: rotate 10s infinite linear;
		border: 2px solid transparent;
		border-radius: 50%;
		padding: 4px;
		will-change: transform;

		&:active,
		&:hover, {
			animation-play-state: paused;
		}
	}
</style>
