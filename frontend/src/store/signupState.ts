import { SignUpType } from "@pages/SignUpPage";
import { atom } from "recoil";

const signupState = atom<SignUpType>({
  key: "signupState",
  default: {
    email: "",
    name: "",
    provider: "",
    providerId: "",
    nickname: "",
    difficulty: 0,
    categories: [],
    skin: 0,
    eyes: 0,
    mask: 0,
  },
});

export default signupState;
