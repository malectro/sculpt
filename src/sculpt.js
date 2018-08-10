/* @flow */

const isArray = Array.isArray;
const _keys = Object.keys;
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
  return target.concat(items);
}

export function pop(target: Array<any>): Array<any> {
  return target.slice(0, -1);
}

export function unshift(target: Array<any>, items: any): Array<any> {
  let clonedTarget = target.slice();
  clonedTarget.unshift.apply(clonedTarget, items);
  return clonedTarget;
}

export function splice(target: Array<any>, items: Array<any>): Array<any> {
  let clonedTarget = target.slice();
  for (let item of items) {
    clonedTarget.splice.apply(clonedTarget, item);
  }
  return clonedTarget;
}

export function set(target: Array<any> | Object, key: any, value: any): Array<any> | Object {
  let clonedTarget = clone(target);
  clonedTarget[key] = value;
  return clonedTarget;
}

export function unset(target: Object, keys: string | string[]): Object {
  let newObject = {};
  if (!Array.isArray(keys)) {
    keys = [keys];
  }
  _keys(target).forEach(currentKey => {
    if (!keys.includes(currentKey)) {
      newObject[currentKey] = target[currentKey];
    }
  });
  return newObject;
}

export function assign(target: Object, source: Object): Object {
  return _assign(clone(target), source);
}

function apply(target: any, mapper: (mapee: any) => any): any {
  return mapper(target);
}

function map(target: any[], mapper: (mapee: any) => any): any {
  return target.map(mapper);
}

function swap(target: any, value: any): any {
  return value;
}


const sculptors = {
  $push: push,
  $unshift: unshift,
  $splice: splice,
  $set: swap, // $set doesn't behave entirely like set() by design
  $unset: unset,
  $assign: assign,
  $merge: assign,
  $apply: apply,
  $map: map,
};
const commands = _keys(sculptors);


/**
 * Meta Sculptor
 */
export default function sculpt(target: any, spec: Object): any {
  let newValue = clone(target);

  for (let key in spec) {
    if (!sculptors.hasOwnProperty(key)) {
      newValue[key] = sculpt(target[key], spec[key]);
    } else {
      newValue = sculptors[key](newValue, spec[key]);
    }
  }

  return newValue;
}

