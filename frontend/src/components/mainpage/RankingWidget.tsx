import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const RankingWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const championCategory = ["Reading Champion", "Point Champion"];

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

  return (
    <>
      <AnimateContainer>
        <RankingButton onClick={goToPrevious}>좌</RankingButton>
        <AnimatePresence
          initial={false}
          custom={direction}
          onExitComplete={() => setIsAnimating(false)}
        >
          <div className="motion-div-space"></div>
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
        <RankingButton onClick={goToNext}>우</RankingButton>
      </AnimateContainer>
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
    </>
  );
};

const AnimateContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 14rem;
  overflow: hidden;
  margin-top: 2rem;
  .motion-div {
    position: absolute;
    z-index: -1;
  }
  .motion-div-space {
    width: 14rem;
  }
`;

const RankingButton = styled.button`
  margin: 0 1rem;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
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

export default RankingWidget;
