window.addEventListener('DOMContentLoaded', (event) => {
    content = document.getElementById('content')
    let titles = Array.from(content.getElementsByTagName('h2')).slice(1)
    titles.forEach(function (item, index) {
        item.innerHTML = (index + 1).toString() + '.&nbsp;&nbsp;' + item.innerText
        let tocLink = document.createElement('a')
        tocLink.className = 'toc-link'
        tocLink.href = '#toc'
        tocLink.innerHTML = 'Back to Table of Contents'
        item.parentNode.insertBefore(tocLink, item.nextSibling)
    })
})

window.onload = function() {
    document.body.style.display = 'block'
}