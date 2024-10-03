import { atom, selector, useRecoilValue } from "recoil";
import { getStudyProgress } from "@services/goalService";
import { useQuery } from "@tanstack/react-query";
import loginState from "@store/loginState";
import { useEffect } from "react";

export type AchievedGoalsType = {
  readNews: boolean;
  pronounceTest: boolean;
  completeWord: boolean;
};

export type StudyProgressType = {
  isInitialized: boolean;
  goalReadNewsCount: number;
  goalPronounceTestScore: number;
  goalCompleteWord: number;
  currentReadNewsCount: number;
  currentPronounceTestScore: number;
  currentCompleteWord: number;
  achievedGoals: AchievedGoalsType;
  pastAchieved: AchievedGoalsType;
};

export const useStudyProgress = () => {
  const isLogin = useRecoilValue(loginState);
  const { data: studyProgressData } = useQuery<StudyProgressType>({
    queryKey: ["getStudyProgress"],
    queryFn: getStudyProgress,
    enabled: isLogin,
  });

  useEffect(() => {
    if (studyProgressData) {
      // 데이터가 로드되면 goals를 업데이트
    }
  }, [studyProgressData]);

  return studyProgressData;
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
    achievedGoals: {
      readNews: false,
      pronounceTest: false,
      completeWord: false,
    },
    pastAchieved: {
      readNews: false,
      pronounceTest: false,
      completeWord: false,
    },
  },
});

export const goalDataSelector = selector({
  key: "goalDataSelector",
  get: ({ get }) => {
    const progress = get(goalState);
    const achievedGoals = progress?.achievedGoals || {
      readNews: false,
      pronounceTest: false,
      completeWord: false,
    };
    const pastAchieved = progress?.pastAchieved || {
      readNews: false,
      pronounceTest: false,
      completeWord: false,
    };

    return [
      {
        title: "뉴스 읽기",
        current: progress.currentReadNewsCount,
        goal: progress.goalReadNewsCount,
        achieved: achievedGoals.readNews,
        pastAchieved: pastAchieved.readNews,
      },
      {
        title: "단어 테스트",
        current: progress.currentCompleteWord,
        goal: progress.goalCompleteWord,
        achieved: achievedGoals.completeWord,
        pastAchieved: pastAchieved.completeWord,
      },
      {
        title: "발음 테스트",
        current: progress.currentPronounceTestScore,
        goal: progress.goalPronounceTestScore,
        achieved: achievedGoals.pronounceTest,
        pastAchieved: pastAchieved.pronounceTest,
      },
    ];
  },
});

export const goalAverageSelector = selector({
  key: "goalAverageSelector",
  get: ({ get }) => {
    const goalData = get(goalDataSelector);

    const percentages = goalData.map(
      (item) => (Math.min(item.current, item.goal) / item.goal) * 100
    );
    const validPercentages = percentages.filter(
      (p) => !isNaN(p) && isFinite(p)
    );

    const perAverage =
      validPercentages.length > 0
        ? validPercentages.reduce((sum, p) => sum + p, 0) /
          validPercentages.length
        : 0;

    const displayPerAverage =
      perAverage >= 100 ? "COMPLETE" : `${perAverage.toFixed(2)}%`;

    return { perAverage, displayPerAverage };
  },
});

export default goalState;
