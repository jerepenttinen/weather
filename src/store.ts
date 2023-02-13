import { create } from "zustand";

export type Store = {
  city: string;
  setCity: (n: string) => void;
};

export const useStore = create<Store>()((set) => ({
  city: "Tampere",
  setCity: (newCity: string) => set(() => ({ city: newCity })),
}));
