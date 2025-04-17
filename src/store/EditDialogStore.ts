import { create } from "zustand";

type EditDialogStoreType = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

export const useEditDialogStore = create<EditDialogStoreType>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));
