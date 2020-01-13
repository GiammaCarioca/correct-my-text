;(function() {
	;('use strict')

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
	const deleteBtn = document.querySelector('#delete')
	const storagePrefix = 'my-text_'
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

	function autosaveDraft() {
		localStorage.setItem(storagePrefix, text.value)
	}

	function updateCount() {
		autosaveDraft()

		const words = text.value.split(/\s+/).filter(word => word.length > 0).length

		checkMaxWords(words)

		if (text.classList.contains('exceeded')) {
			count.textContent = `You have exceeded the maximum number of ${maxWords} words.`
		} else {
			count.textContent = `You've written ${words} ${isSingular(words)}.`
		}
	}

	function deleteText() {
		text.value = ''
		text.classList.remove('exceeded')
		count.classList.remove('exceeded')

		updateCount()
	}

	function loadData() {
		text.value = localStorage.getItem(storagePrefix)

		// Keep character count on refresh
		updateCount()
	}

	// Load saved data from storage
	loadData()

	text.addEventListener('input', updateCount, false)
	deleteBtn.addEventListener('click', deleteText, false)
})()
