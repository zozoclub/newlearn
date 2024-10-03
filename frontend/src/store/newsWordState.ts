import { WordType } from "@services/newsService";
import { atom } from "recoil";

const newsWordState = atom<WordType[]>({
  key: "newsWordState",
  default: [],
});

export default newsWordState;
