import sculpt, {push, unshift, splice, set, assign, apply, map} from '../src/sculpt';

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

    it('freezes the result', () => {
      const result = push([1], [7]);
      expect(result.push.bind(result, 8)).toThrowError(TypeError,
        'Can\'t add property 2, object is not extensible'
      );
    });

    it('does not mutate the target', () => {
      const target = [1];
      push(target, 2);
      expect(target).toEqual([1]);
    });
  });

  describe('unshift', () => {
    it('unhifts', () => {
      expect(unshift([1], [7])).toEqual([7, 1]);
    });

    it('does not unshift single elements', () => {
      expect(unshift.bind(null, [1], 7)).toThrowError(TypeError,
        'Function.prototype.apply: Arguments list has wrong type'
      );
    });

    it('unshifts multiple elements', () => {
      expect(unshift([1], [7, 8, 2])).toEqual([7, 8, 2, 1]);
    });

    it('freezes the result', () => {
      const result = unshift([1], [7]);
      expect(result.push.bind(result, 8)).toThrowError(TypeError,
        'Can\'t add property 2, object is not extensible'
      );
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

    it('freezes the result', () => {
      const result = splice([1, 5, 2], [[1, 1, 2]]);
      expect(result.push.bind(result, 8)).toThrowError(TypeError,
        'Can\'t add property 3, object is not extensible'
      );
    });

    it('does not mutate the target', () => {
      const target = [1, 5, 2];
      splice(target, [[1, 1, 2]]);
      expect(target).toEqual([1, 5, 2]);
    });
  });

  describe('set', () => {
    it('sets', () => {
      expect(set({key: 1}, 'key', 2)).toEqual({key: 2});
    });
  });
});

