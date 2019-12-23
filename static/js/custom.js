window.addEventListener('DOMContentLoaded', (event) => {
    content = document.getElementById('content')
    let titles = Array.from(content.getElementsByTagName('h1')).slice(2)
    titles.forEach(function (item, index) {
        item.innerHTML = (index + 1).toString() + '.&nbsp;&nbsp;' + item.innerText
        let tocLink = document.createElement('a')
        tocLink.className = 'toc-link'
        tocLink.href = '#toc'
        tocLink.innerHTML = 'Back to Table of Contents'
        item.parentNode.insertBefore(tocLink, item.nextSibling)
    })

    let toc = document.getElementById('TableOfContents')
    let tocUL = toc.getElementsByTagName('ul')[0]
    if (tocUL != null) {
        let tocOL = document.createElement('ol')
        tocOL.innerHTML = tocUL.innerHTML
        tocUL.parentNode.replaceChild(tocOL, tocUL)
    }})

window.onload = function() {
    document.body.style.display = 'block'
}