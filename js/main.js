;(function() {
	;('use strict')

	//
	// Variables
	//

	const text = document.querySelector('#text')
	const count = document.querySelector('#count')
	const submit = document.querySelector('#submit')
	const storagePrefix = 'my-text_'
	const maxWords = 10
	const minWords = 5

	const title = document.querySelector('#title')
	const wordsLeft = document.querySelector('#wordsLeft')

	//
	// Methods
	//

	/**
	 * String.prototype.trim() polyfill
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
	 */
	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
		}
	}

	const countWords = _ =>
		text.value.split(/\s+/).filter(word => word.length > 0).length

	const checkMinWords = words => {
		if (!words) return

		return words > minWords ? true : false
	}

	const checkMaxWords = words => {
		if (!words) return

		return words > maxWords ? true : false
	}

	const isSingular = words => (words === 1 ? 'word' : 'words')

	const autosaveDraft = () => {
		const storedData = {
			title: title.textContent,
			text: text.value
		}

		if (!title || !text) return

		const storedDataString = JSON.stringify(storedData)
		localStorage.setItem(storagePrefix, storedDataString)
	}

	const updateCount = () => {
		autosaveDraft()

		const words = countWords()

		maxWords > words
			? (wordsLeft.textContent = `Words left: ${maxWords - words}`)
			: (wordsLeft.textContent = `Congrats! You reached you goal!`)

		if (checkMinWords(words)) {
			submit.classList.add('min')
		} else {
			submit.classList.remove('min')
		}

		if (checkMaxWords(words)) {
			text.classList.add('exceeded')
			count.classList.add('exceeded')
		} else {
			text.classList.remove('exceeded')
			count.classList.remove('exceeded')
		}

		if (text.classList.contains('exceeded')) {
			count.textContent = `You have exceeded the maximum number of ${maxWords} words.`
		} else {
			count.textContent = `You've written ${words} ${isSingular(words)}.`
		}
	}

	const cleanInput = event => {
		// Only run for the #delete button
		if (event.target.id !== 'delete') return

		// Confirm with the user before deleting
		if (
			!window.confirm(
				'Are you sure you want to delete this draft? This cannot be undone.'
			)
		)
			return

		text.value = ''
		submit.classList.remove('min')
		text.classList.remove('exceeded')
		count.classList.remove('exceeded')

		updateCount()
	}

	const submitHandler = event => {
		// Only run for the #draft form
		if (!event.target.closest('form').matches('#draft')) return

		event.preventDefault()

		if (!checkMinWords(countWords())) {
			if (
				!window.confirm(
					'Mmm... not enough words. Are you sure you wanna send your text anyway?'
				)
			) {
				console.log('ok, not sent!')
				return
			}
		}

		if (
			title.textContent.length === 0 ||
			title.textContent === 'Write The Title Here'
		) {
			return
		}

		console.log('ok, sent!')

		submit.classList.remove('min')
		count.classList.remove('exceeded')
		localStorage.removeItem(storagePrefix)
		title.textContent = 'Write The Title Here'
		text.value = ''
		updateCount()
	}

	const loadData = () => {
		let savedData = localStorage.getItem(storagePrefix)
		savedData = savedData ? JSON.parse(savedData) : {}

		title.innerHTML = savedData.title || 'Write The Title Here'
		text.value = savedData.text || ''

		updateCount()
	}

	//
	// Inits & Event Listeners
	//

	// Load saved data from storage
	loadData()

	// Listen for input events
	document.addEventListener('input', updateCount, false)

	// Listen for click events
	document.addEventListener('click', cleanInput, false)

	// Listen for submit events
	document.addEventListener('submit', submitHandler, false)

	title.addEventListener('keydown', event => {
		if (
			event.which != 8 &&
			title.innerHTML.length >= title.getAttribute('max')
		) {
			event.preventDefault()
			return false
		}

		autosaveDraft()
	})
})()
