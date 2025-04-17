import { create } from "zustand";
import Tag from "@classes/tag/Tag";
interface useTagsArrayStore {
    tags: Tag[];
    addTag: (tag: Tag) => void;
    removeTag: (tag: Tag) => void;
    setTags: (tags: Tag[]) => void;
}
export const useTagsArrayStore = create<useTagsArrayStore>((set) => ({
    tags: [] as Tag[],
    addTag: (tag: Tag) => set((state) => ({ tags: [...state.tags, tag] })),
    removeTag: (tag: Tag) =>
        set((state) => ({ tags: state.tags.filter((t) => t !== tag) })),
    setTags: (tags: Tag[]) => set(() => ({ tags })),
}));
