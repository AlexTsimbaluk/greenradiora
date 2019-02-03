<template>
	<div
		class="ripple"
		@click="ripple($event)"
	>
		<div class="ripple-c"></div>
	</div>
</template>



<script>

	export default {
		name: 'Ripple',
		data () {
			return {
				
			}
		},
		methods: {
			// TODO: переделать на vue
			ripple (event) {
				var $ripple = event.target;
				var $btn = $ripple.parentElement;
				var offset = $btn.getBoundingClientRect();
				var $circle = $ripple.children[0];

				var x = event.pageX - offset.left;
				var y = event.pageY - offset.top;

				if($circle) {
					$circle.style.top = y + 'px';
					$circle.style.left = x + 'px';
				}

				$ripple.classList.add('is-active');

				let animationEnd = () => {
					$ripple.classList.remove('is-active');
				}

				$ripple.addEventListener('animationend', animationEnd);
				$ripple.addEventListener('webkitAnimationEnd', animationEnd);
				$ripple.addEventListener('oanimationend', animationEnd);
				$ripple.addEventListener('MSAnimationEnd', animationEnd);
			}
		},
		created () {
			// console.log('::Ripple:hook:created');
		}
	}

</script>



<style lang="less">
	.ripple {
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  overflow: hidden;
	  background: transparent;
	  [disabled] & {
	  	display: none;
	  }
	}

	.ripple-c {
	  position: absolute;
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%, -50%);
	  opacity: 0;
	  width: 0;
	  height: 0;
	  border-radius: 50%;
	  background: rgba(255, 255, 255, .25);
	  .ripple.is-active & {
	    animation: a-ripple .4s ease-in;
	  }
	}


	@purple: #9c27b0;
	@purple: rebeccapurple;
	
	@purple: purple;
	@purple: rgba(128, 0, 128, 0.50);
	@light-purple: rgba(128, 0, 255, 0.50);
	
	@cyan: #0ff;
	@cyan: rgba(0, 255, 255, 0.50);

	@green: #0f0;
	@green: rgba(0, 255, 0, 0.50);
	
	@blue: #00f;
	@blue: rgba(0, 0, 255, 0.50);

	@keyframes a-ripple {
	  0% {
	  	background: @light-purple;
	    opacity: 0;
	  }
	  25% {
	    opacity: 1;
	  	background: @blue;
	  }
	  50% {
	  	background: @green;
	  }
	  75% {
	  	background: @cyan;
	  }
	  100% {
	  	background: @purple;
	    padding-bottom: 200%;
	    opacity: 0;
	    width: 200%;
	  }
	}
</style>