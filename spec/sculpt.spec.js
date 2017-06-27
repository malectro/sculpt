import sculpt, {push, pop, unshift, splice, set, unset, assign} from '../src/sculpt';

describe('sculpt', () => {

  describe('push', () => {
    it('pushes', () => {
      expect(push([1], [7])).toEqual([1, 7]);
    });

    it('pushes single elements', () => {
      expect(push([1], 7)).toEqual([1, 7]);
    });

    it('pushes multiple elements', () => {
      expect(push([1], [7, 8, 2])).toEqual([1, 7, 8, 2]);
    });

    it('does not mutate the target', () => {
      const target = [1];
      push(target, 2);
      expect(target).toEqual([1]);
    });
  });

  describe('pop', () => {
    it('pops', () => {
      expect(pop([1, 2, 3])).toEqual([1, 2]);
    });

    it('deals with empty arrays', () => {
      expect(pop([])).toEqual([]);
    });

    it('does not mutate the target', () => {
      const target = [1];
      pop(target);
      expect(target).toEqual([1]);
    });

    it('returns the target if the array is already empty', () => {
      const target = [];
      expect(pop(target)).toBe(target);
    });
  });

  describe('unshift', () => {
    it('unhifts', () => {
      expect(unshift([1], [7])).toEqual([7, 1]);
    });

    it('does not unshift single elements', () => {
      expect(unshift.bind(null, [1], 7)).toThrowError(TypeError);
    });

    it('unshifts multiple elements', () => {
      expect(unshift([1], [7, 8, 2])).toEqual([7, 8, 2, 1]);
    });

    it('does not mutate the target', () => {
      const target = [1];
      unshift(target, [2]);
      expect(target).toEqual([1]);
    });
  });

  describe('splice', () => {
    it('splices', () => {
      expect(splice([1, 5, 2], [[1, 1, 2]])).toEqual([1, 2, 2]);
    });

    it('splices multiple param groups', () => {
      expect(splice([1, 5, 2, 8], [[1, 1, 2], [2, 2, 6]])).toEqual([1, 2, 6]);
    });

    it('does not mutate the target', () => {
      const target = [1, 5, 2];
      splice(target, [[1, 1, 2]]);
      expect(target).toEqual([1, 5, 2]);
    });
  });

  describe('set', () => {
    it('sets', () => {
      expect(set({key: 1, key2: 2}, 'key', 2)).toEqual({key: 2, key2: 2});
    });

    it('does not mutate the target', () => {
      const target = {key: 1};
      set(target, 'key', 2);
      expect(target).toEqual({key: 1});
    });

    it('returns the target if the values are equal', () => {
      const target = {key: 1};
      expect(set(target, 'key', 1)).toBe(target);
    });
  });

  describe('unset', () => {
    it('unsets', () => {
      expect(unset({key: 1, key2: 2}, 'key')).toEqual({key2: 2});
    });

    it('handles empty objects', () => {
      expect(unset({}, 'key')).toEqual({});
    });

    it('does not mutate the target', () => {
      const target = {key: 1};
      unset(target, 'key');
      expect(target).toEqual({key: 1});
    });

    it('returns the target if the key does not exist', () => {
      const target = {};
      expect(unset(target, 'key')).toBe(target);
    });
  });

  describe('assign', () => {
    it('assigns', () => {
      expect(assign({key: 1, key2: 2}, {key: 3, key3: 4})).toEqual({key: 3, key2: 2, key3: 4});
    });

    it('does not mutate the target', () => {
      const target = {key: 1};
      assign(target, {key: 2});
      expect(target).toEqual({key: 1});
    });

    // NOTE (malectro): because we use the native Object.assign internally, it
    // would be inefficient to check equality.
    /*
    it('returns the target if the properties and values already exist on the target', () => {
      const subtarget = {};
      const target = {key: 1, key2: subtarget};
      expect(assign(target, {key: 1, key2: subtarget})).toBe(target);
    });
    */
  });

  describe('sculpt', () => {
    describe('$apply', () => {
      const target = {
        key: [1, 2, 3],
      };
      const result = sculpt(target, {
        key: {
          $apply: array => array.filter(val => val !== 2),
        },
      });

      it('applies', () => {
        expect(result).toEqual({
          key: [1, 3],
        });
      });

      it('does not mutate the target', () => {
        expect(target).toEqual({
          key: [1, 2, 3],
        });
      });
    });

    describe('$map', () => {
      const target = {
        key: [1, 2, 3],
      };

      const result = sculpt(target, {
        key: {
          $map: val => val + 1,
        },
      });

      it('maps', () => {
        expect(result).toEqual({
          key: [2, 3, 4],
        });
      });

      it('does not mutate the target', () => {
        expect(target).toEqual({
          key: [1, 2, 3],
        });
      });
    });

    it('sculpts well', () => {
      const target = {
        order: [1, 2, 3, 4],
        models: {
          '1': {
            id: 1,
            name: 'green',
          },
          '2': {
            id: 2,
            name: 'blue',
          },
          '3': {
            id: 3,
            name: 'red',
          },
          '4': {
            id: 4,
            name: 'black',
          },
        },
      };

      const result = sculpt(target, {
        order: {
          $apply: order => order.filter(id => id !== 2),
          $push: 2,
        },
        models: {
          '2': {
            name: {
              $set: 'orange',
            },
          },
        },
      });

      expect(result).toEqual({
        order: [1, 3, 4, 2],
        models: {
          '1': {
            id: 1,
            name: 'green',
          },
          '2': {
            id: 2,
            name: 'orange',
          },
          '3': {
            id: 3,
            name: 'red',
          },
          '4': {
            id: 4,
            name: 'black',
          },
        },
      });
    });
  });

  it('returns the target if the result is deep equal', () => {
    const target = {
      '1': {
        '1': [],
      },
      '2': 3,
    };

    const result = sculpt(target, {
      '1': {
        '1': {
          $apply: array => array,
        },
        $unset: '2',
      },
      '2': {
        $set: 3,
      },
    });

    expect(result).toBe(target);
  });

});

