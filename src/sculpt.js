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
export function push(target: Array<any>, items: any): Array<any> {
  return freeze(target.concat(items));
}

export function unshift(target: Array<any>, items: any): Array<any> {
  let clonedTarget = target.slice();
  clonedTarget.unshift.apply(clonedTarget, items);
  return freeze(clonedTarget);
}

export function splice(target: Array<any>, items: Array<any>): Array<any> {
  let clonedTarget = target.slice();
  for (let item of items) {
    clonedTarget.splice.apply(clonedTarget, item);
  }
  return freeze(clonedTarget);
}

export function set(target: Array<any> | Object, key: any, value: any): Array<any> | Object {
  let clonedTarget = clone(target);
  clonedTarget[key] = freeze(value);
  return freeze(clonedTarget);
}

export function assign(target: Object, source: Object): Object {
  return freeze(_assign(clone(target), source));
}

export function apply(target: any, mapper: (mapee: any) => any): any {
  return freeze(mapper(target));
}

export function map(target: any[], mapper: (mapee: any) => any): any {
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
  $merge: assign,
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

