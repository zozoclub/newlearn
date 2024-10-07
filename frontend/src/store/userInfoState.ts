import { atom } from "recoil";

export type userInfoType = {
  isInitialized: boolean;
  userId: string;
  skin: number;
  eyes: number;
  mask: number;
  email: string;
  nickname: string;
  name: string;
  provider: string;
  rank: number;
  difficulty: number;
  categories: string[];
  experience: number;
  totalNewsReadCount: number;
  unCompleteWordCount: number;
  completeWordCount: number;
  savedWordCount: number;
  scrapCount: number;
};

const userInfoState = atom<userInfoType>({
  key: "userInfoState",
  default: {
    isInitialized: false,
    userId: "",
    skin: 0,
    eyes: 0,
    mask: 0,
    email: "",
    nickname: "",
    name: "",
    provider: "",
    rank: 0,
    difficulty: 2,
    categories: [],
    experience: 0,
    totalNewsReadCount: 0,
    unCompleteWordCount: 0,
    completeWordCount: 0,
    savedWordCount: 0,
    scrapCount: 0,
  },
});

export default userInfoState;
