import { atom, selector } from "recoil";

export type StudyProgressType = {
  isInitialized: boolean;
  goalReadNewsCount: number;
  goalPronounceTestScore: number;
  goalCompleteWord: number;
  currentReadNewsCount: number;
  currentPronounceTestScore: number;
  currentCompleteWord: number;
};

export const goalState = atom<StudyProgressType>({
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

export const goalDataSelector = selector({
  key: "goalDataSelector",
  get: ({ get }) => {
    const progress = get(goalState);
    return [
      {
        title: "뉴스 읽기",
        current: progress.currentReadNewsCount,
        goal: progress.goalReadNewsCount,
      },
      {
        title: "단어 테스트",
        current: progress.currentCompleteWord,
        goal: progress.goalCompleteWord,
      },
      {
        title: "발음 테스트",
        current: progress.currentPronounceTestScore,
        goal: progress.goalPronounceTestScore,
      },
    ];
  },
});

export const goalAverageSelector = selector({
  key: "goalAverageSelector",
  get: ({ get }) => {
    const goalData = get(goalDataSelector);

    const percentages = goalData.map(
      (item) => (item.current / item.goal) * 100
    );
    const validPercentages = percentages.filter(
      (p) => !isNaN(p) && isFinite(p)
    );

    const perAverage =
      validPercentages.length > 0
        ? Math.min(
            validPercentages.reduce((sum, p) => sum + p, 0) /
              validPercentages.length,
            100
          )
        : 0;

    const displayPerAverage =
      perAverage >= 100 ? "COMPLETE" : `${perAverage.toFixed(2)}%`;

    return { perAverage, displayPerAverage };
  },
});

export default goalState;
