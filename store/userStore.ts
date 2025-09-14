import { userDataType } from "@/types/Types";
import { create } from "zustand";

interface userData {
  userData: userDataType | null;
  setUserData: (newData: userDataType | null) => void;
  updateUserData: (newData: userDataType | null) => void;
}

export const useUserData = create<userData>((set) => ({
  userData: null,
  setUserData: (newData) => set({ userData: newData }),
  updateUserData: (newData) =>
    set((state) => ({
      userData: { ...state.userData, ...newData },
    })),
}));
