import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import CategoryChart from "@components/CategoryChart";

import PuzzleIcon from "@assets/icons/puzzleIcon.png";

type CountDataKey =
  | "economyCount"
  | "politicsCount"
  | "societyCount"
  | "cultureCount"
  | "scienceCount"
  | "globalCount";

type CountData = {
  [K in CountDataKey]: number;
};

const Widget: React.FC<{ variety: string }> = ({ variety }) => {
  const countData: CountData = {
    economyCount: 7,
    politicsCount: 12,
    societyCount: 4,
    cultureCount: 16,
    scienceCount: 3,
    globalCount: 7,
  };
  const championCategory = ["Reading Champion", "Point Champion"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useCallback(
    (newDirection: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(newDirection);
      setCurrentIndex((prevIndex) => {
        if (newDirection === -1) {
          return prevIndex === 0 ? championCategory.length - 1 : prevIndex - 1;
        } else {
          return (prevIndex + 1) % championCategory.length;
        }
      });
    },
    [championCategory.length, isAnimating]
  );

  const goToPrevious = useCallback(() => navigate(-1), [navigate]);
  const goToNext = useCallback(() => navigate(1), [navigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  switch (variety) {
    case "profile":
      return (
        <Container>
          <Descripsion>My Information</Descripsion>
          <ProfileImage $persentage={25}>
            <img src={PuzzleIcon} />
          </ProfileImage>
          <div>Lv.32 Coding Larva</div>
          <ReadStatus>
            <div>
              <div>Read</div>
              <div>20</div>
            </div>
            <div>
              <div>Speak</div>
              <div>32</div>
            </div>
            <div>
              <div>Scrap</div>
              <div>17</div>
            </div>
          </ReadStatus>
        </Container>
      );
    case "chart":
      return (
        <Container>
          <Descripsion>Learn Category</Descripsion>
          <CategoryChart countData={countData} />
        </Container>
      );
    case "ranking":
      return (
        <Container>
          <Descripsion>Ranking</Descripsion>
          <div className="animate-container">
            <button onClick={goToPrevious}>좌</button>
            <div className="middle-space"></div>
            <AnimatePresence
              initial={false}
              custom={direction}
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="motion-div"
              >
                {championCategory[currentIndex]}
              </motion.div>
            </AnimatePresence>
            <button onClick={goToNext}>우</button>
          </div>
          <MyRank>
            My Rank <span>495</span>th
          </MyRank>
          <TopRank>
            <div className="first-price">
              Lv.32 <span>덩국이</span>
            </div>
            <div className="second-price">
              Lv.32 <span>덩국이</span>
            </div>
            <div className="third-price">
              Lv.32 <span>덩국이</span>
            </div>
          </TopRank>
        </Container>
      );
    case "goal":
      return (
        <Container>
          <Descripsion>study goal</Descripsion>
        </Container>
      );
  }
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  aspect-ratio: 1;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  border-radius: 0.75rem;
  transition: box-shadow 0.5s;
  backdrop-filter: blur(4px);
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  .animate-container {
    margin-top: 2rem;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    button {
      margin: 0;
      padding: 0;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
    .motion-div {
      position: absolute;
      text-align: center;
    }
  }
  .middle-space {
    width: 10rem;
    margin: 0 1rem;
  }
`;

const Descripsion = styled.div`
  position: absolute;
  top: -1.5rem;
  left: 0.25rem;
  font-size: 0.875rem;
`;

const ProfileImage = styled.div<{ $persentage: number }>`
  position: relative;
  border-radius: 100%;
  width: 50%;
  height: 50%;
  margin: 1rem 0 0.5rem 0;
  background: conic-gradient(
    ${(props) => props.theme.colors.primary} 0% ${(props) => props.$persentage}%,
    transparent 25% 100%
  );
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    transform: translate(-50%, -50%);
    border-radius: 100%;
    background-color: #ffffff;
  }
`;

const ReadStatus = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 4rem);
  margin: 1rem 2rem;
  div {
    text-align: center;
    :first-child {
      margin: 0.75rem 0 0.75rem 0;
    }
  }
`;

const MyRank = styled.div`
  font-size: 1.25rem;
  margin: 2.5rem 0;
`;

const TopRank = styled.div`
  width: calc(100% - 4rem);
  padding: 0 2rem;
  .first-price {
    color: yellow;
    margin-bottom: 1.25rem;
    :first-child {
      font-size: 1.5rem;
    }
  }
  .second-price {
    color: silver;
    margin-bottom: 1.25rem;
    :first-child {
      font-size: 1.5rem;
    }
  }
  .third-price {
    color: brown;
    :first-child {
      font-size: 1.5rem;
    }
  }
`;

export default Widget;
