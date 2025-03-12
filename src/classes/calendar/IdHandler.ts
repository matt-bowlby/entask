class IdHandler {
    /**
     * Array of all used IDs.
     */
    private static ids: Array<number> = [];

    /**
     * Map of IDs to instances.
     */
    private static idMap: Map<number, Object> = new Map();

    /**
     * Constructor.
     * @param current_ids load ids into IdHandler
     */
    constructor(current_ids: Array<number>) {
        IdHandler.ids = current_ids;
    }

    /**
     * Returns a new unique ID.
     * @returns A new unique ID.
     */
    static requestId(instance: Object): number {
        let id: number = 0;
        while (IdHandler.ids.includes(id)) {
            id++;
        }
        IdHandler.ids.push(id);
        IdHandler.idMap.set(id, instance); // Store the instance with the ID
        return id;
    }

    /**
     * Returns the instance associated with the given ID.
     * @param id ID to retrieve.
     * @returns The instance associated with the ID, or undefined if not found.
     */
    static getInstance(id: number): Object | undefined {
        return IdHandler.idMap.get(id);
    }


    /**
     * Releases an ID.
     * @param id ID to release.
     */
    static releaseId(id: number): void {
        IdHandler.ids = IdHandler.ids.filter((value) => value !== id);
    }

    /**
     * Return ID list.
     * @returns ID list.
     */
    public getIds(): Array<number> {
        return IdHandler.ids;
    }
}

export { IdHandler };