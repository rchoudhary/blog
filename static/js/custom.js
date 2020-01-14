function getTOCLink() {
    let tocLink = document.createElement('a')
    tocLink.className = 'toc-link'
    tocLink.href = '#toc'
    tocLink.innerHTML = 'Back to Table of Contents'
    return tocLink
}

window.addEventListener('DOMContentLoaded', (event) => {
    content = document.getElementById('content')

    if (content === null) {
        return
    }

    let titles = Array.from(content.getElementsByTagName('h2')).slice(1)
    titles.forEach(function (item, index) {
        item.innerHTML = (index + 1).toString() + '.&nbsp;&nbsp;' + item.innerHTML
        let tocLink = getTOCLink()
        item.parentNode.insertBefore(tocLink, item.nextSibling)
    })

    let subtitles = Array.from(content.getElementsByTagName('h3'))
    let indexOffset = 0
    let lastH2 = ''
    subtitles.forEach(function (item, index) {
        let parentHeader = item.previousElementSibling
        while (parentHeader.tagName !== 'H2') {
            parentHeader = parentHeader.previousElementSibling
        }
        if (parentHeader.tagName === 'H2') {
            let text = parentHeader.innerText
            let parentNumber = text.substring(0, text.indexOf('.'))
            if (parentHeader.innerText !== lastH2) {
                indexOffset = index
                lastH2 = parentHeader.innerText
            }
            item.innerHTML = parentNumber + '.' + (index + 1 - indexOffset).toString() + '.&nbsp;&nbsp;' + item.innerText
        }
        let tocLink = getTOCLink()
        item.parentNode.insertBefore(tocLink, item.nextSibling)
    })

    let asides = Array.from(content.getElementsByClassName('aside'))
    asides.forEach(function (aside, index) {
        let asideTitle = Array.from(aside.children)[0]
        let everythingElse = Array.from(aside.children).slice(1)
        let hidden = true
        everythingElse.forEach(function (otherChild, index) {
            otherChild.hidden = hidden
        })
        asideTitle.onclick = function () {
            everythingElse.forEach(function (otherChild, index) {
                otherChild.hidden = !hidden
            })
            hidden = !hidden
            if (hidden) {
                aside.style.paddingBottom = "0px";
            }
            else {
                aside.style.paddingBottom = "25px";
            }
        }
    })

    let links = Array.from(content.getElementsByTagName('a'))
    links.forEach(function (link, index) {
        let windowLoc = window.location.href
        let currLoc = windowLoc.substring(0, windowLoc.lastIndexOf('/') + 1);
        if (link.href === '' || link.href.includes(currLoc)) {
            return
        }
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.setAttribute('aria-label', 'Opens in new tab/window')
    })

    let images = Array.from(content.getElementsByTagName('img'))
    images.forEach(function (image, index) {
        let src = image.src
        let finalSlashIdx = src.lastIndexOf('/')
        let dotIdx = src.indexOf('.')
        let filename = src.substring(finalSlashIdx + 1, dotIdx)
        let figure = image.parentElement
        figure.id = filename
    })
    console.log(images)
})

window.onload = function() {
    document.body.style.display = 'block'
}