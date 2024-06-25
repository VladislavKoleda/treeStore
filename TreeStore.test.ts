import { TreeStore, Item } from './treeStore';

describe('TreeStore', () => {
    let items: Item[];
    let treeStore: TreeStore;

    beforeEach(() => {
        items = [
            { id: 1, parent: 'root' },
            { id: 2, parent: 1, type: 'test' },
            { id: 3, parent: 1, type: 'test' },
            { id: 4, parent: 2, type: 'test' },
            { id: 5, parent: 2, type: 'test' },
            { id: 6, parent: 2, type: 'test' },
            { id: 7, parent: 4, type: null },
            { id: 8, parent: 4, type: null },
        ];
        treeStore = new TreeStore(items);
    });

    test('getAll should return all items', () => {
        expect(treeStore.getAll()).toEqual(items);
    });

    test('getItem should return the correct item by id', () => {
        expect(treeStore.getItem(7)).toEqual({ id: 7, parent: 4, type: null });
        expect(treeStore.getItem(99)).toBeUndefined();
    });

    test('getChildren should return the correct children items', () => {
        expect(treeStore.getChildren(4)).toEqual([
            { id: 7, parent: 4, type: null },
            { id: 8, parent: 4, type: null },
        ]);
        expect(treeStore.getChildren(5)).toEqual([]);
        expect(treeStore.getChildren(2)).toEqual([
            { id: 4, parent: 2, type: 'test' },
            { id: 5, parent: 2, type: 'test' },
            { id: 6, parent: 2, type: 'test' },
        ]);
    });

    test('getAllChildren should return all nested children', () => {
        expect(treeStore.getAllChildren(2)).toEqual([
            { id: 4, parent: 2, type: 'test' },
            { id: 5, parent: 2, type: 'test' },
            { id: 6, parent: 2, type: 'test' },
            { id: 7, parent: 4, type: null },
            { id: 8, parent: 4, type: null },
        ]);
    });

    test('getAllParents should return all parent items in the correct order', () => {
        expect(treeStore.getAllParents(7)).toEqual([
            { id: 4, parent: 2, type: 'test' },
            { id: 2, parent: 1, type: 'test' },
            { id: 1, parent: 'root' },
        ]);
    });
});
