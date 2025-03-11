class IdHandler {
    /**
     * Array of all used IDs.
     */
    private static ids: Array<number> = [];

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
    static requestId(): number {
        let id: number = 0;
        while (IdHandler.ids.includes(id)) {
            id++;
        }
        IdHandler.ids.push(id);
        return id;
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