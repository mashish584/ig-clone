import {merge} from '../../src/apollo/Client';

describe('Apollo Client', () => {
  it('should merge two list with some items in it', () => {
    const existingItems = {items: [1, 2]};
    const newItems = {items: [3, 4]};
    const result = merge(existingItems, newItems);
    expect(result.items.length).toBe(4);
    expect(result.items).toEqual([1, 2, 3, 4]);
  });

  it('should return new items in list if existing items not available', () => {
    const existingItems = {};
    const newItems = {items: [1, 2]};
    const result = merge(existingItems, newItems);
    expect(result.items.length).toBe(2);
    expect(result.items).toEqual([1, 2]);
  });
});
