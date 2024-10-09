import { tutorialTipState } from "@store/tutorialState";
import { allowScroll, preventScroll } from "@utils/preventScroll";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const TutorialTip = () => {
  const [tutorialTip, setTutorialTip] = useRecoilState(tutorialTipState);
  const { steps, isActive, onComplete } = tutorialTip;
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [contentStyle, setContentStyle] = useState({});
  const appContainer = document
    .querySelector("#app-container")
    ?.getBoundingClientRect();

  const updateHighlightStyle = () => {
    if (isActive && steps[currentStep]) {
      const element = document.querySelector(steps[currentStep].selector);
      if (element && appContainer) {
        const { top: appTop, right: appRight } = appContainer;
        console.log(appTop, appRight);
        const rect = element.getBoundingClientRect();
        console.log(rect.left, rect.left + (appRight - (rect.left + 128)));
        setHighlightStyle({
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        });

        setContentStyle({
          top: `${rect.top - 128 < appTop ? rect.bottom : rect.top - 96}px`,
          left: `${rect.left + 128 > appRight ? rect.left - 128 : rect.left}px`,
        });
      }
    }
  };

  useEffect(() => {
    updateHighlightStyle();

    // Listen to window resize events
    const handleResize = () => {
      updateHighlightStyle();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isActive, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      setCurrentStep(0);
    }
  };

  const handleSkipButton = () => {
    setTutorialTip({
      steps: [],
      isActive: false,
      onComplete: () => {
        console.log("튜토리얼 스킵!");
      },
    });
    setCurrentStep(0);
  };

  // 튜토리얼 창이 열려있는 동안 스크롤 방지
  useEffect(() => {
    if (isActive) {
      preventScroll();
    } else {
      allowScroll();
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      {
        <>
          <Overlay
            style={highlightStyle}
            onClick={() => handleNext()}
          ></Overlay>
          <SkipButton onClick={handleSkipButton}>Skip</SkipButton>
          <Content style={contentStyle} onClick={() => handleNext()}>
            <div>{steps[currentStep].content}</div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <StepButton>
                {currentStep + 1}/{steps.length}
              </StepButton>
            </div>
          </Content>
        </>
      }
    </>
  );
};

export default TutorialTip;

const Overlay = styled.div`
  position: fixed;
  z-index: 500;
  outline: 3000px solid rgba(0, 0, 0, 0.7); /* 검은색 바깥 부분 */
  pointer-events: none; /* 기본적으로 클릭을 허용하지 않음 */

  &::before {
    content: "";
    position: absolute;
    top: -3000px;
    bottom: -3000px;
    left: -3000px;
    right: -3000px;
    pointer-events: auto; /* 바깥 outline 부분만 클릭 막기 */
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: fixed;
  z-index: 501;
  color: ${(props) => props.theme.colors.background};
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  pointer-events: auto; /* 콘텐츠 부분은 클릭 가능 */
`;

const StepButton = styled.div`
  padding: 0.25rem 0.5rem;
  letter-spacing: 0.1rem;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 0.5rem;
  cursor: pointer;
`;

const SkipButton = styled.div`
  position: fixed;
  z-index: 502;
  bottom: 5%;
  right: 5%;
  width: 4rem;
  padding: 1rem;
  font-size: 1.25rem;
  text-align: center;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: ${(props) => props.theme.shadows.small};
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
