// GoalManager.tsx
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import goalState, {
  AchievedGoalsType,
  StudyProgressType,
} from "@store/goalState";
import { getStudyProgress } from "@services/goalService";
import { isExpModalState } from "@store/expState";
import { putExpUp } from "@services/userService";

const AppGoalManager: React.FC<{ isLogin: boolean }> = ({ isLogin }) => {
  const userProgress = useRecoilValue(goalState);
  const setUserProgress = useSetRecoilState(goalState);
  const setExpModal = useSetRecoilState(isExpModalState);

  const { data: studyProgressData } = useQuery({
    queryKey: ["getStudyProgress"],
    queryFn: getStudyProgress,
    enabled: isLogin,
  });

  // 로그인 시 현재 상태를 저장하고 pastAchieved 계산
  useEffect(() => {
    if (studyProgressData) {
      setUserProgress(() => {
        const newState = { ...studyProgressData, isInitialized: true };
        newState.pastAchieved = {
          readNews: newState.currentReadNewsCount >= newState.goalReadNewsCount,
          completeWord:
            newState.currentCompleteWord >= newState.goalCompleteWord,
          pronounceTest:
            newState.currentPronounceTestScore >=
            newState.goalPronounceTestScore,
        };
        return newState;
      });
    }
  }, [studyProgressData, setUserProgress]);

  // 목표 달성 여부 감지 및 모달 표시
  useEffect(() => {
    const checkAchievement = (progress: StudyProgressType) => {
      const goals: Array<{
        name: keyof AchievedGoalsType;
        current: number;
        goal: number;
        exp: number;
        displayName: string;
      }> = [
        {
          name: "readNews",
          current: progress.currentReadNewsCount,
          goal: progress.goalReadNewsCount,
          exp: progress.goalReadNewsCount * 10,
          displayName: "뉴스 읽기",
        },
        {
          name: "completeWord",
          current: progress.currentCompleteWord,
          goal: progress.goalCompleteWord,
          exp: progress.goalCompleteWord * 2,
          displayName: "단어 테스트",
        },
        {
          name: "pronounceTest",
          current: progress.currentPronounceTestScore,
          goal: progress.goalPronounceTestScore,
          exp: progress.goalPronounceTestScore * 2,
          displayName: "발음 테스트",
        },
      ];

      goals.forEach(({ name, current, goal, exp, displayName }) => {
        if (current === goal && !progress.pastAchieved[name] && exp !== 0) {
          putExpUp(exp, setExpModal, `${displayName} 목표 달성`);
        }
      });
    };

    setUserProgress((progress) => {
      checkAchievement(progress);
      return progress;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProgress, setUserProgress]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default AppGoalManager;
