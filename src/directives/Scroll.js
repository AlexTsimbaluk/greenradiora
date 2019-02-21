export default {
	inserted: function (el, binding) {
		let f = function (evt) {
			/*if (binding.value(evt, el)) {
				window.removeEventListener('scroll', f);
			}*/

			console.log(evt);
		}

		// window.addEventListener('scroll', f);
		el.addEventListener('scroll', f);
	}
};