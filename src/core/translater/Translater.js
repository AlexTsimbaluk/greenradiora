import Vue from 'vue';

import decodeCode from '@/core/translater/SymbolsData.js';
import Utils from '@/Utils.js';

export default new Vue({
	data () {
		return {

		}
	},
	methods: {
		decodeText (text) {
			let symbolArray = (text + '').split('');
			let codeArray = this.getSymbolCode(text);
			let decodeArray = [];
			let newText = ''; 

			for (let i = 0; i < codeArray.length; i++) {
				if((codeArray[i] >= 32 && codeArray[i] <= 90) || 	// A -Z
				(codeArray[i] >= 97 && codeArray[i] <= 122)) { 		// a - z
					let newCode = decodeCode(codeArray[i]);
					let newSymbol = (newCode[Utils.getRandomInt(0, newCode.length - 1)]);
					decodeArray.push(newSymbol);
					// console.log(symbolArray[i] + ' - ' + newCode);
				} else {
					decodeArray.push(symbolArray[i]);
				}
			}

			// todo: добавить вывод итогового результата для $(.before-decode).val()
			// в какой нибудь блок (тоже добавить в $(.devel .symbols))

			newText = decodeArray.join('');
			return newText;
		},

		getSymbolCode (text) {
			let codeArray = (text + '').split('');

			for (let i = 0; i < codeArray.length; i++) {
				codeArray[i] = codeArray[i].charCodeAt(0);
			}

			return codeArray;
		}
	},
	created () {
		console.log('@@@ Translater:hook:created');
	}
});
