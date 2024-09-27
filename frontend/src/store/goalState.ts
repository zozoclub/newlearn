import { atom } from "recoil";

export type StudyProgressType = {
  isInitialized: boolean;
  goalReadNewsCount: number;
  goalPronounceTestScore: number;
  goalCompleteWord: number;
  currentReadNewsCount: number;
  currentPronounceTestScore: number;
  currentCompleteWord: number;
};

const goalState = atom<StudyProgressType>({
  key: "goalState",
  default: {
    isInitialized: false,
    goalReadNewsCount: 0,
    goalPronounceTestScore: 0,
    goalCompleteWord: 0,
    currentReadNewsCount: 0,
    currentPronounceTestScore: 0,
    currentCompleteWord: 0,
  },
});

export default goalState;
