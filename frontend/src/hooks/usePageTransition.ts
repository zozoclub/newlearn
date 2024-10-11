import { useSetRecoilState } from "recoil";
import { pageTransitionState } from "@store/pageTransition";

export const usePageTransition = () => {
  const setPageTransition = useSetRecoilState(pageTransitionState);

  const transitionTo = (path: string) => {
    setPageTransition({
      isTransitioning: true,
      targetLocation: path,
    });
    // 실제 네비게이션은 App 컴포넌트에서 처리됩니다.
  };

  return transitionTo;
};
