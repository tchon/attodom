var EVENTS = require('./src/events')

var htmlProps = {
	id: true,
	nodeValue: true,
	textContent: true,
	className: true,
	innerHTML: true,
	tabIndex: true,
	value: true
}

/**
 * @param {string} tagName
 * @return {HTMLElement}
 */
module.exports = function(tagName) {
	var node = document.createElement(tagName)

	for (var i=1; i<arguments.length; ++i) {
		var arg = arguments[i]
		if (arg != null) {
			if (!arg.constructor || arg.constructor === Object) for (var j=0, ks=Object.keys(arg); j<ks.length; ++j) {
				var key = ks[j],
						val = arg[key]
				if (key === 'style') node.style.cssText = val
				else if (typeof val !== 'string' || htmlProps[key]) node[key] = val
				else node.setAttribute(key, val)

				//set synthetic events for onUpperCaseName
				if (key[0] === 'o' && key[1] === 'n' && key.charCodeAt(2) < 91 && key.charCodeAt(2) > 64 && !EVENTS[key]) {
					document.addEventListener(key.slice(2).toLowerCase(), function(e) { //eslint-disable-line
						var tgt = e.target
						do if (tgt[key]) return tgt[key](e)
						//@ts-ignore
						while((tgt = tgt.parentNode))
					})
					EVENTS[key] = true
				}
			}
			else {
				var kids = arg == null ? [] : Array.isArray(arg) ? arg : [arg]
				for (var k=0; k<kids.length; ++k) node.appendChild(
					kids[k].nodeType ? kids[k] : document.createTextNode(kids[k])
				)
			}
		}
	}
	return node
}
