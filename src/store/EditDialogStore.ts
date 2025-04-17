import Thing from "@/classes/thing/Thing";
import { create } from "zustand";

export enum DialogType {
    Task,
    Event,
    TagBlock,
}

type EditDialogStoreType = {
    isOpen: boolean;
    type: DialogType;
    open: (dialogType: DialogType) => void;
    close: () => void;
    setData: (arg0: Thing) => void;
    data: Thing | undefined;
};

export const useEditDialogStore = create<EditDialogStoreType>((set) => ({
    isOpen: false,
    type: DialogType.Task, // default value
    open: (dialogType: DialogType) => set({ isOpen: true, type: dialogType }),
    close: () => set({ isOpen: false }),
    setData: (t: Thing) => set({ data: t }),
    data: undefined,
}));
