import { CameraCapturedPicture } from "expo-camera";

let selfieImage: CameraCapturedPicture;
export function setSelfieImage(img: any) {
  selfieImage = img;
}
export function getSelfieImage() {
  return selfieImage;
}
