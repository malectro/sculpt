'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.push = push;
exports.pop = pop;
exports.unshift = unshift;
exports.splice = splice;
exports.set = set;
exports.unset = unset;
exports.assign = assign;
exports.default = sculpt;
var isArray = Array.isArray;
var _keys = Object.keys;
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
  return target.concat(items);
}

function pop(target) {
  return target.slice(0, -1);
}

function unshift(target, items) {
  var clonedTarget = target.slice();
  clonedTarget.unshift.apply(clonedTarget, items);
  return clonedTarget;
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

  return clonedTarget;
}

function set(target, key, value) {
  var clonedTarget = clone(target);
  clonedTarget[key] = value;
  return clonedTarget;
}

function unset(target, keys) {
  var newObject = {};
  if (!Array.isArray(keys)) {
    keys = [keys];
  }
  _keys(target).forEach(function (currentKey) {
    if (!keys.includes(currentKey)) {
      newObject[currentKey] = target[currentKey];
    }
  });
  return newObject;
}

function assign(target, source) {
  return _assign(clone(target), source);
}

function apply(target, mapper) {
  return mapper(target);
}

function map(target, mapper) {
  return target.map(mapper);
}

function swap(target, value) {
  return value;
}

var sculptors = {
  $push: push,
  $unshift: unshift,
  $splice: splice,
  $set: swap, // $set doesn't behave entirely like set() by design
  $unset: unset,
  $assign: assign,
  $merge: assign,
  $apply: apply,
  $map: map
};
var commands = _keys(sculptors);

/**
 * Meta Sculptor
 */
function sculpt(target, spec) {
  var newValue = clone(target);

  for (var key in spec) {
    if (!sculptors.hasOwnProperty(key)) {
      newValue[key] = sculpt(target[key], spec[key]);
    } else {
      newValue = sculptors[key](newValue, spec[key]);
    }
  }

  return newValue;
}
