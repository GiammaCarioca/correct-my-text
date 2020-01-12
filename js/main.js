;(function() {
	'use strict'

	/**
	 * String.prototype.trim() polyfill
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
	 */
	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
		}
	}

	const text = document.querySelector('#text')
	const count = document.querySelector('#count')
	const maxWords = 5

	function checkMaxWords(words) {
		if (!words) return

		if (words > maxWords) {
			text.classList.add('exceeded')
			count.classList.add('exceeded')
		} else {
			text.classList.remove('exceeded')
			count.classList.remove('exceeded')
		}
	}

	function isSingular(words) {
		return words === 1 ? 'word' : 'words'
	}

	function updateCount() {
		const words = text.value.split(/\s+/).filter(word => word.length > 0).length

		checkMaxWords(words)

		if (text.classList.contains('exceeded')) {
			count.textContent = `You have exceeded the maximum number of ${maxWords} words.`
		} else {
			count.textContent = `You've written ${words} ${isSingular(words)}.`
		}
	}

	// Keep character count on refresh
	updateCount()

	text.addEventListener('input', updateCount, false)
})()
