import { atom } from "recoil";

const languageState = atom<"kr" | "en">({
  key: "languageState",
  default: "en",
});

export default languageState;
