import { tutorialTipState } from "@store/tutorialState";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

const TutorialTip = () => {
  const tutorialTip = useRecoilValue(tutorialTipState);
  const { steps, isActive, onComplete } = tutorialTip;
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [contentStyle, setContentStyle] = useState({});

  const updateHighlightStyle = () => {
    if (isActive && steps[currentStep]) {
      const element = document.querySelector(steps[currentStep].selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightStyle({
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        });
        setContentStyle({
          top: `${rect.top - 64}px`,
          left: `${rect.left + rect.width + 16}px`,
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

  if (!isActive) return null;

  return (
    <>
      {
        <>
          <Overlay style={highlightStyle}></Overlay>
          <Content style={contentStyle}>
            <div>{steps[currentStep].content}</div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <StepButton onClick={() => handleNext()}>
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
  outline: 3000px solid black;
  opacity: 0.7;
  pointer-events: none;
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
`;

const StepButton = styled.div`
  padding: 0.25rem 0.5rem;
  letter-spacing: 0.1rem;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 0.5rem;
  cursor: pointer;
`;
