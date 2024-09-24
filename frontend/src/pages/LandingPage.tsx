import React, { useRef, useEffect } from "react";
import styled from "styled-components";

const LandingPage: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;

    const boxes = mainRef.current.querySelectorAll<HTMLDivElement>(".box");
    let ticking = false;

    const handleScroll = (): void => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          boxes.forEach((box) => {
            const rect = box.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const start = windowHeight * 0.9;
            const end = windowHeight * 0.2;

            const progress = (start - rect.bottom) / (start - end);

            if (progress >= 0 && progress <= 1) {
              const xPosition = easeInOutQuad(progress) * 300;
              box.style.transform = `translateX(${xPosition}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Easing function
  const easeInOutQuad = (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  return (
    <div>
      <Section>
        <h2>Basic ScrollTrigger with React</h2>
        <p>Scroll down to see the magic happen!!</p>
      </Section>
      <Section ref={mainRef}>
        <div className="box">클로드가 짜준</div>
        <div className="box">애니메이션</div>
        <div className="box">그냥 개신기함...</div>
        <div className="box">그냥 개신기함...</div>
        <div className="box">그냥 개신기함...</div>
      </Section>
      <section className="section"></section>
    </div>
  );
};

const Section = styled.div`
  width: 100%;
  height: 200vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  .box {
    will-change: transform;
  }
`;

export default LandingPage;
