import { atom } from "recoil";

export const navbarState = atom<boolean>({
  key: "navbarState",
  default: true,
});

export default navbarState;
