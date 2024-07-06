/**
 * A class to represent a collection of unique items
 * @template T The type of the items in the collection
 * @class UniqueArray
 * @example
 * const uniqueNumbers = new UniqueArray<number>()
 * uniqueNumbers.add(1)
 * uniqueNumbers.add(2)
 * uniqueNumbers.add(2) // This won't be added, as it's a duplicate
 * console.log(uniqueNumbers.allItems) // Output: [1, 2]
 * const mappedNumbers = uniqueNumbers.map((x) => x * 2)
 * console.log(mappedNumbers) // Output: [2, 4]
 * const filteredNumbers = uniqueNumbers.filter((x) => x > 1)
 * console.log(filteredNumbers) // Output: [2]
 *
 *
 */
export class UniqueArray<T> {
    private items: Set<T>

    constructor(items?: Iterable<T>) {
        this.items = new Set(items)
    }

    // Static method for initialization from an array
    static from<U>(items: Iterable<U>): UniqueArray<U> {
        return new UniqueArray<U>(items)
    }

    // Method to add an item, leveraging the Set's inherent uniqueness
    add(item: T): void {
        this.items.add(item)
    }

    // Method to remove an item
    delete(item: T): boolean {
        return this.items.delete(item)
    }

    find = (callback: (item: T, index: number, array: T[]) => boolean): T | undefined => {
        return Array.from(this.items).find(callback)
    }

    // Method to map over the items, converting the Set to an array temporarily
    map<U>(callback: (item: T, index: number, array: T[]) => U): U[] {
        return Array.from(this.items).map(callback)
    }

    // Method to filter the items, also converting the Set to an array
    filter(callback: (item: T, index: number, array: T[]) => boolean): T[] {
        return Array.from(this.items).filter(callback)
    }

    forEach(callback: (value: T, value2: T, set: Set<T>) => void): void {
        this.items.forEach(callback)
    }

    // Getter to return all items as an array
    get allItems(): T[] {
        return Array.from(this.items)
    }

    // Method to check if an item exists
    has(item: T): boolean {
        return this.items.has(item)
    }

    // Method to get the size of the collection
    get size(): number {
        return this.items.size
    }
}
