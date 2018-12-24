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

	@keyframes a-ripple {
	  0% {
	    opacity: 0;
	  }
	  25% {
	    opacity: 1;
	  }
	  100% {
	    width: 200%;
	    padding-bottom: 200%;
	    opacity: 0;
	  }
	}
</style>