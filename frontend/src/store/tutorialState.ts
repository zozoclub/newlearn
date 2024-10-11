import { atom } from "recoil";

interface TutorialStep {
  selector: string;
  content: string;
  isNeedToGo?: boolean;
}

type TutorialTipType = {
  steps: TutorialStep[];
  isActive: boolean;
  onComplete: () => void;
};

export const tutorialTipState = atom<TutorialTipType>({
  key: "tutorialTipState",
  default: {
    steps: [],
    isActive: false,
    onComplete: () => {},
  },
});
