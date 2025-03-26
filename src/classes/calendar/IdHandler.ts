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
     * Registers a new ID. If ID is already registered, does nothing.
     * @param id ID to register.
     */
    public static registerId(id: number, instance: Object): void {
        if (!IdHandler.ids.includes(id)) {
            IdHandler.ids.push(id);
            IdHandler.idMap.set(id, instance); // Initialize with an empty object
        }
    }

    /**
     * Returns a new unique ID.
     * @returns A new unique ID.
     */
    public static requestId(instance: Object): number {
        let id: number = 0;
        while (IdHandler.ids.includes(id)) {
            id++;
        }
        IdHandler.registerId(id, instance);
        return id;
    }

    /**
     * Returns the instance associated with the given ID.
     * @param id ID to retrieve.
     * @returns The instance associated with the ID, or undefined if not found.
     */
    public static getInstance(id: number): Object | undefined {
        return IdHandler.idMap.get(id);
    }


    /**
     * Releases an ID.
     * @param id ID to release.
     */
    public static releaseId(id: number): void {
        IdHandler.ids = IdHandler.ids.filter((value) => value !== id);
    }

    /**
     * Return ID list.
     * @returns ID list.
     */
    public static getIds(): Array<number> {
        return IdHandler.ids;
    }
}

export default IdHandler;