import { CameraCapturedPicture } from "expo-camera";
import { create } from "zustand";

interface SelfieStore {
  selfieImage: CameraCapturedPicture | null;
  setSelfieImage: (image: CameraCapturedPicture | null) => void;
  clearSelfieImage: () => void;
}

export const useSelfieStore = create<SelfieStore>((set) => ({
  selfieImage: null,
  setSelfieImage: (image) => set({ selfieImage: image }),
  clearSelfieImage: () => set({ selfieImage: null }),
}));

// Backward compatibility (optional - you can remove these later)
export const setSelfieImage = (img: CameraCapturedPicture | null) => {
  useSelfieStore.getState().setSelfieImage(img);
};

export const getSelfieImage = () => {
  return useSelfieStore.getState().selfieImage;
};
