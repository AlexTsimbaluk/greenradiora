import Vue from 'vue';

import decodeCode from '@/core/translater/SymbolsData.js';
import Utils from '@/Utils.js';

export default new Vue({
	data () {
		return {

		}
	},
	methods: {
		translateTarget () {
			return $(
				'.title, '
				+ ' .url, '
			    + ' .playlist .vmTitle, '
			    + ' .currentTrackTitle' // не переводит - ??
			    + ' .adminItem .nav-btn:not(.showConsole):not([data-toggle="dropdown"]), '
			    + ' .remove a, '
			    + ' form button'
		    );
		},
		// прнимает коллекцию тегов с текстом
		// заменить на данные из стейта
		// translateText(translateTarget()) - вызов по клику
		translateText ($elements, init) {
			console.log('::translateText');

			// var $elements = $('.track .url');

			// клик по кнопке перевода, или нужен перевод после загрузки страницы
			if((!playerState.translated && !init) || (playerState.translated && init)) {
				console.log('need translate');
				console.log(playerState.translated);

				translateCollection($elements, true);
				$('.translate-text').attr('data-translated', 1);

				playerState.translated = true;
				localStorage.setItem('playerState', JSON.stringify(playerState));
			} else {
				console.log('need original');
				console.log(playerState.translated);

				translateCollection($elements, false);
				$('.translate-text').removeAttr('data-translated');

				// translateAllText(false);

				playerState.translated = false;
				localStorage.setItem('playerState', JSON.stringify(playerState));
			}
		},

		translateCollection ($collection, needTranslate) {
			if(needTranslate) {
				$collection.each(function(index, el) {
					var $el = $(el);
					var originalText = $el.text()
					var translatedText = decodeText(originalText);

					if(!$el.attr('data-orirginal-text')) {
						$el.attr('data-orirginal-text', originalText);
					}
					$el.text(translatedText);
				});
			} else {
				$collection.each(function(index, el) {
					var $el = $(el);
					var originalText = $el.attr('data-orirginal-text');

					$el.text(originalText);
				});
			}
		},

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
		},

		// decodeCode(code)
	},
	created () {
		console.log('@@@ Translater:hook:created');


	}
});
