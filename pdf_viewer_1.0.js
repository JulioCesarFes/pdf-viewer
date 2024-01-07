{

	window.onload = function () {
		let elementsFound = document.querySelectorAll('[data-pdf-preview]')

		for (let element of elementsFound) new PDFViewer(element)
	}

	function addFakeStyleClass(className, element) {
		let classes = {
			'pages': {
				boxSizing: 'border-box',
				display: 'flex',
				flexDirection: 'column',
				padding: '1.6cm',
				gap: '1.6cm',
				background: '#f1f1f1'
			},

			'page': {
				boxSizing: 'border-box',
				width: '21cm',
				height: '29.7cm',
				padding: '1.6cm',
				background: 'white',
				borderRadius: '4px',
				boxShadow: '0 1px 4px grey',
			},

			'safe-check-area': {
				boxSizing: 'border-box',
				position: 'absolute',
				width: '100%',
				opacity: '0',
				pointerEvents: 'none',
			}
		}

		for (let property in classes[className]) {
			element.style[property] = classes[className][property]
		}
	}

	class PDFViewer {
		constructor (pagesArea) {
			let nodes = pagesArea.childNodes

			let currentPage = new Page
			let pages = [currentPage]

			for (let node of nodes) {
				let page = currentPage

				page.addNode(node)

				if (page.heightInvalid()) {
					page.removeLastNode()
					currentPage = new Page
					pages.push(currentPage)
				}
			}

			pagesArea.innerHTML = ''
			addFakeStyleClass('pages', pagesArea)

			for (let page of pages) {
				let element = page.element
				pagesArea.append(element)
			}
		}
	}

	class Page {
		constructor () {
			this.element = document.createElement('div')
			addFakeStyleClass('page', this.element)
		}

		addNode (node) { this.element.append(node) }
		removeLastNode () { this.element.lastChild.remove() }

		heightInvalid () {
			let safeArea = Page.getSafeAreaToCheck()

			safeArea.innerHTML = ''
			safeArea.append(this.element)

			let h1 = this.element.clientHeight
			let h2 = this.element.offsetHeight
			let h3 = this.element.scrollHeight
			safeArea.innerHTML = ''

			return !(h1 == h2 && h1 == h3)
		}

		static getSafeAreaToCheck () {
			if (typeof this.safeArea == 'undefined') {

				this.safeArea = document.createElement('div')
				document.querySelector('body').append(this.safeArea)
				addFakeStyleClass('safe-check-area', this.safeArea)
			}

			return this.safeArea
		}
	}

}
