import { useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import goalState, {
  StudyProgressType,
  AchievedGoalsType,
} from "@store/goalState";
import { isExpModalState, ExpType } from "@store/expState";

interface Goal {
  name: keyof AchievedGoalsType;
  current: number;
  goal: number;
  exp: number;
}

const useGoalAchievementModal = (): void => {
  const currentGoalState = useRecoilValue<StudyProgressType>(goalState);
  const setExpModal = useSetRecoilState<ExpType>(isExpModalState);
  const prevGoalStateRef = useRef<StudyProgressType>(currentGoalState);

  useEffect(() => {
    if (currentGoalState.isInitialized) {
      const goals: Goal[] = [
        {
          name: "readNews",
          current: currentGoalState.currentReadNewsCount,
          goal: currentGoalState.goalReadNewsCount,
          exp: 50,
        },
        {
          name: "completeWord",
          current: currentGoalState.currentCompleteWord,
          goal: currentGoalState.goalCompleteWord,
          exp: 30,
        },
        {
          name: "pronounceTest",
          current: currentGoalState.currentPronounceTestScore,
          goal: currentGoalState.goalPronounceTestScore,
          exp: 40,
        },
      ];

      goals.forEach(({ name, current, goal, exp }) => {
        const prevCurrent = prevGoalStateRef.current[
          `current${
            name.charAt(0).toUpperCase() + name.slice(1)
          }` as keyof StudyProgressType
        ] as number;
        const pastAchieved = prevCurrent > goal;
        const achieved = current === goal;

        if (achieved && !pastAchieved) {
          setExpModal({
            isOpen: true,
            experience: exp,
            action: `${name.replace(/([A-Z])/g, " $1").trim()} 목표 달성`,
          });
        }
      });
    }

    prevGoalStateRef.current = currentGoalState;
  }, [currentGoalState, setExpModal]);
};

export default useGoalAchievementModal;
