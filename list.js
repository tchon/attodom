var common = require('./common'),
		placeItem = require('./src/place-item'),
		thisAssign = require('./src/this-assign'),
		move = require('./src/list-move'),
		remove = require('./src/list-remove')

/**
 * @function
 * @param {!Function} factory
 * @param {Function} [getKey]
 * @return {!Object} Component
 */
module.exports = function list(factory, getKey) {
	return new CKeyed(factory, getKey)
}

/**
 * @constructor
 * @param {!Function} factory
 * @param {Function} [getKey]
 */
function CKeyed(factory, getKey) {
	this.refs = Object.create(null)
	this.factory = factory
	this.getKey = getKey || getIndex

	this.node = common.document.createComment('^')
	this.foot = common.document.createComment('$')
}

CKeyed.prototype = {
	c: thisAssign,
	remove: remove,
	moveTo: move,
	update: updateKeyedChildren,
	updateChildren: updateKeyedChildren
}

function updateKeyedChildren(arr) {
	var foot = this.foot,
			parent = foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			refs = Object.create(null) //manually deleting items requires the item to also hold it's key

	if (!parent) throw Error('list update requires a parent node')

	for (var i = 0; i < arr.length; ++i) {
		var key = this.getKey(arr[i], i, arr),
				item = refs[key] = items[key] || this.factory(key, arr[i], i, arr)
		// place before update since lists require a parent before update
		spot = placeItem(parent, item, spot, foot).nextSibling
		if (item.update) item.update(arr[i], i, arr)
	}

	this.refs = refs

	while (spot !== this.foot) {
		var next = spot.nextSibling
		parent.removeChild(spot)
		spot = next
	}

	return this
}

function getIndex(v,i) {
	return i // default: indexed
}
