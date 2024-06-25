 export class TreeStore {
    private items: Item[];
    private itemMap: Map<number | string, Item>;
    private childrenMap: Map<number | string, Item[]>;

    constructor(items: Item[]) {
        this.items = items;
        this.itemMap = new Map();
        this.childrenMap = new Map();

        this.initMaps();
    }

    private initMaps() {
        this.items.forEach(item => {
            this.itemMap.set(item.id, item);
            if (!this.childrenMap.has(item.parent)) {
                this.childrenMap.set(item.parent, []);
            }
            this.childrenMap.get(item.parent)!.push(item);
        });
    }

    getAll(): Item[] {
        return this.items;
    }

    getItem(id: number | string): Item | undefined {
        return this.itemMap.get(id);
    }

    getChildren(id: number | string): Item[] {
        return this.childrenMap.get(id) || [];
    }

    getAllChildren(id: number | string): Item[] {
        const result: Item[] = [];
        const queue: (number | string)[] = [id];

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const child = this.getChildren(currentId);
            result.push(...child);
            child.forEach(c => queue.push(c.id));
        }

        return result;
    }

    getAllParents(id: number | string): Item[] {
        const result: Item[] = [];
        let currentItem = this.getItem(id);

        while (currentItem && currentItem.parent !== 'root') {
            currentItem = this.getItem(currentItem.parent);
            if (currentItem) {
                result.push(currentItem);
            }
        }

        return result;
    }
}

export interface Item {
    id: number | string;
    parent: number | string;
    type?: string | null;
}

//ИСХОДНЫЕ ДАННЫЕ:
const items: Item[] = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },
    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },
    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];

const ts = new TreeStore(items);

// Пример использования:
console.log('getAll()', ts.getAll()); // [{"id":1,"parent":"root"},{"id":2,"parent":1,"type":"test"},{"id":3,"parent":1,"type":"test"},{"id":4,"parent":2,"type":"test"},{"id":5,"parent":2,"type":"test"},{"id":6,"parent":2,"type":"test"},{"id":7,"parent":4,"type":null},{"id":8,"parent":4,"type":null}]
console.log('getItem(7)', ts.getItem(7)); // {"id":7,"parent":4,"type":null}
console.log('getChildren(4)', ts.getChildren(4)); // [{"id":7,"parent":4,"type":null},{"id":8,"parent":4,"type":null}]
console.log('getChildren(5)', ts.getChildren(5)); // []
console.log('getChildren(2)', ts.getChildren(2)); // [{"id":4,"parent":2,"type":"test"},{"id":5,"parent":2,"type":"test"},{"id":6,"parent":2,"type":"test"}]
console.log('getAllChildren(2)', ts.getAllChildren(2)); // [{"id":4,"parent":2,"type":"test"},{"id":5,"parent":2,"type":"test"},{"id":6,"parent":2,"type":"test"},{"id":7,"parent":4,"type":null},{"id":8,"parent":4,"type":null}]
console.log('getAllParents(7)', ts.getAllParents(7)); // [{"id":4,"parent":2,"type":"test"},{"id":2,"parent":1,"type":"test"},{"id":1,"parent":"root"}]
