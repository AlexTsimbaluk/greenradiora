import Utils from '@/Utils.js';

export default {
	inserted: function (el) {
		el.focus();
		Utils.setCursorPosition(el, 0, el.value.length);
	}
};