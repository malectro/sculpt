'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.push = push;
exports.unshift = unshift;
exports.splice = splice;
exports.set = set;
exports.assign = assign;
exports.apply = apply;
exports.map = map;
exports.default = sculpt;


var isArray = Array.isArray;
var freeze = Object.freeze;
var keys = Object.keys;
var _assign = Object.assign;

function clone(thing) {
  if (isArray(thing)) {
    thing = thing.slice();
  } else if ((typeof thing === 'undefined' ? 'undefined' : _typeof(thing)) === 'object') {
    thing = _assign({}, thing);
  }
  return thing;
}

/**
 * Basic Sculptors
 */
function push(target, items) {
  return freeze(target.concat(items));
}

function unshift(target, items) {
  var clonedTarget = target.slice();
  clonedTarget.unshift.apply(clonedTarget, items);
  return freeze(clonedTarget);
}

function splice(target, items) {
  var clonedTarget = target.slice();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      clonedTarget.splice.apply(clonedTarget, item);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return freeze(clonedTarget);
}

function set(target, key, value) {
  var clonedTarget = clone(target);
  clonedTarget[key] = freeze(value);
  return freeze(clonedTarget);
}

function assign(target, source) {
  return freeze(_assign(clone(target), source));
}

function apply(target, mapper) {
  return freeze(mapper(target));
}

function map(target, mapper) {
  return freeze(target.map(mapper));
}

function swap(target, value) {
  return freeze(value);
}

var sculptors = {
  $push: push,
  $unshift: unshift,
  $splice: splice,
  $set: swap, // $set doesn't behave entirely like set() by design
  $assign: assign,
  $merge: assign,
  $apply: apply,
  $map: map
};
var commands = keys(sculptors);

/**
 * Meta Sculptor
 */
function sculpt(target, spec) {
  var newValue = clone(target);

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = commands[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var command = _step2.value;

      if (spec.hasOwnProperty(command)) {
        newValue = sculptors[command](newValue, spec[command]);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  for (var key in spec) {
    if (!sculptors.hasOwnProperty(key)) {
      newValue[key] = sculpt(target[key], spec[key]);
    }
  }

  return freeze(newValue);
}
