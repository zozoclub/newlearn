import { WordType } from "types/wordType";
import { atom } from "recoil";

const newsWordState = atom<WordType[]>({
  key: "newsWordState",
  default: [],
});

export default newsWordState;
