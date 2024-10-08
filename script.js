const TrieNode = function (key) {
	// the "key" value will be the character in sequence
	this.key = key

	// we keep a reference to parent
	this.parent = null

	// we have hash of children
	this.children = {}

	// check to see if the node is at the end
	this.end = false

	this.getWord = function () {
		let output = []
		let node = this

		while (node !== null) {
			output.unshift(node.key)
			node = node.parent
		}

		return output.join('')
	}
}

const Trie = function () {
	this.root = new TrieNode(null)

	// inserts a word into the trie.
	this.insert = function (word) {
		let node = this.root // we start at the root

		// for every character in the word
		for (let i = 0; i < word.length; i++) {
			// check to see if character node exists in children.
			if (!node.children[word[i]]) {
				// if it doesn't exist, we then create it.
				node.children[word[i]] = new TrieNode(word[i])

				// we also assign the parent to the child node.
				node.children[word[i]].parent = node
			}

			// proceed to the next depth in the trie.
			node = node.children[word[i]]

			// finally, we check to see if it's the last word.
			if (i == word.length - 1) {
				// if it is, we set the end flag to true.
				node.end = true
			}
		}
	}

	// check if it contains a whole word.
	this.contains = function (word) {
		let node = this.root

		// for every character in the word
		for (let i = 0; i < word.length; i++) {
			// check to see if character node exists in children.
			if (node.children[word[i]]) {
				// if it exists, proceed to the next depth of the trie.
				node = node.children[word[i]]
			} else {
				// doesn't exist, return false since it's not a valid word.
				return false
			}
		}

		// we finished going through all the words, but is it a whole word?
		return node.end
	}

	// returns every word with given prefix
	this.find = function (prefix) {
		let node = this.root
		let output = []

		// for every character in the prefix
		for (let i = 0; i < prefix.length; i++) {
			// make sure prefix actually has words
			if (node.children[prefix[i]]) {
				node = node.children[prefix[i]]
			} else {
				// there's none. just return it.
				return output
			}
		}

		// recursively find all words in the node
		findAllWords(node, output)

		return output
	}

	// recursive function to find all words in the given node.
	const findAllWords = (node, arr) => {
		// base case, if node is at a word, push to output
		if (node.end) {
			arr.unshift(node.getWord())
		}

		// iterate through each children, call recursive findAllWords
		for (let child in node.children) {
			findAllWords(node.children[child], arr)
		}
	}

	// removes a word from the trie.
	this.remove = function (word) {
		let root = this.root

		if (!word) return

		// recursively finds and removes a word
		const removeWord = (node, word) => {
			// check if current node contains the word
			if (node.end && node.getWord() === word) {
				// check and see if node has children
				let hasChildren = Object.keys(node.children).length > 0

				// if has children we only want to un-flag the end node that marks the end of a word.
				// this way we do not remove words that contain/include supplied word
				if (hasChildren) {
					node.end = false
				} else {
					// remove word by getting parent and setting children to empty dictionary
					node.parent.children = {}
				}

				return true
			}

			// recursively remove word from all children
			for (let key in node.children) {
				removeWord(node.children[key], word)
			}

			return false
		}

		// call remove word on root node
		removeWord(root, word)
	}
}

const trie = new Trie()
const N = 5
var searchbar = document.getElementById('search')
var searchbtn = document.getElementById('hdnbtn')
var searchcontainer = document.getElementById('search-contain')
var popoutcolour = 'rgba(255, 252, 252, 0.437)'

searchbar.addEventListener('keyup', checkIfEnter)
searchbtn.addEventListener('click', getval)

function getval(event) {
	newWord = searchbar.value
	trie.insert(newWord)
}

function flashBar() {
	searchbar.classList.add('flash')
	setTimeout(function () {
		searchbar.classList.remove('flash')
	}, 150)
}

function checkIfEnter(event) {
	if (event.key === 'Enter') {
		flashBar()
		searchbtn.click()
	} else {
		newWord = searchbar.value
		if (newWord !== '') {
			let output = trie.find(newWord)
			if (output.length > 0) {
				if (document.getElementsByTagName('ul').length > 0) {
					ul.remove()
				}

				ul = document.createElement('ul')
				searchcontainer.appendChild(ul)
				output = output.slice(0, N)
				for (let i = 0; i < output.length; i++) {
					buttonHolder = document.createElement('div')
					buttonHolder.classList.add('button-holder')
					remove = document.createElement('button')
					remove.classList.add('removebtn')
					remove.id = output[i]
					remove.textContent = 'X'
					button = document.createElement('button')
					remove.addEventListener('click', removeWord)
					button.id = 'testbtn'
					buttonHolder.id = `button-holder-${output[i]}`
					buttonHolder.style.backgroundColor = popoutcolour
					buttonHolder.appendChild(button)
					ul.appendChild(buttonHolder)
					buttonHolder.appendChild(remove)
					button.textContent = output[i]
				}
			} else {
				if (document.getElementsByTagName('ul').length > 0) {
					ul.remove()
				}
			}
		} else {
			ul.remove()
		}
	}
}

function removeWord(event) {
	newWord = event.target.id
	trie.remove(newWord)

	document.getElementById(`button-holder-${newWord}`).remove()
}
