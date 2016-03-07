/* @flow */

const isArray = Array.isArray;
const freeze = Object.freeze;
const keys = Object.keys;
const _assign = Object.assign;

function clone(thing: any): any {
  if (isArray(thing)) {
    thing = thing.slice();
  } else if (typeof thing === 'object') {
    thing = _assign({}, thing);
  }
  return thing;
}


/**
 * Basic Sculptors
 */
export function push(target: Array, items: any): Array {
  return freeze(target.concat(items));
}

export function unshift(target: Array, items: any): Array {
  let clone = target.slice();
  clone.unshift(items);
  return freeze(clone);
}

export function splice(target: Array, items: Array): Array {
  let clone = target.slice();
  for (let item of items) {
    clone.splice(item);
  }
  return freeze(clone);
}

export function set(target: Array | Object, key: any, value: any): Array | Object {
  let clonedTarget = clone(target);
  clonedTarget[key] = freeze(value);
  return freeze(clone);
}

export function assign(target: Object, source: Object): Object {
  return freeze(_assign({}, target, source));
}

export function apply(target: any, mapper: Function): any {
  return freeze(mapper(target));
}

export function map(target: Array, mapper: Function): any {
  return freeze(target.map(mapper));
}

function swap(target: any, value: any): any {
  return freeze(value);
}


const sculptors = {
  $push: push,
  $unshift: unshift,
  $splice: splice,
  $set: swap, // $set doesn't behave entirely like set() by design
  $assign: assign,
  $apply: apply,
  $map: map,
};
const commands = keys(sculptors);


/**
 * Meta Sculptor
 */
export default function sculpt(target: any, spec: Object): any {
  let newValue = clone(target);

  for (let command of commands) {
    if (spec.hasOwnProperty(command)) {
      newValue = sculptors[command](newValue, spec[command]);
    }
  }

  for (let key in spec) {
    if (!sculptors.hasOwnProperty(key)) {
      newValue[key] = sculpt(target[key], spec[key]);
    }
  }

  return freeze(newValue);
}

