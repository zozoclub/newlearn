import { readNews } from "@services/newsService";
import { RefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import goalState from "@store/goalState";
import { useParams } from "react-router-dom";
import languageState from "@store/languageState";
import { isExpModalState } from "@store/expState";

type ProgressBarPropsType = {
  engIsLoading: boolean;
  korIsLoading: boolean;
  isFirstView: boolean;
  setIsFirstView: React.Dispatch<React.SetStateAction<boolean>>;
  isRead: boolean[] | undefined;
  setIsRead: React.Dispatch<React.SetStateAction<boolean[] | undefined>>;
  difficulty: number;
  isReadFinished: boolean;
  setIsReadFinished: React.Dispatch<React.SetStateAction<boolean>>;
  newsContainerRef: RefObject<HTMLDivElement>;
};

const ProgressBar: React.FC<ProgressBarPropsType> = ({
  engIsLoading,
  korIsLoading,
  isFirstView,
  setIsFirstView,
  isRead,
  setIsRead,
  difficulty,
  isReadFinished,
  setIsReadFinished,
  newsContainerRef,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [userProgress, setUserProgress] = useRecoilState(goalState);
  const languageData = useRecoilValue(languageState);
  const { newsId } = useParams();
  const isLoadingRef = useRef<boolean>(engIsLoading || korIsLoading);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef<boolean>(false);
  const setExpModal = useSetRecoilState(isExpModalState);

  // 현재 Loading 상태
  useEffect(() => {
    isLoadingRef.current = engIsLoading || korIsLoading;
  }, [engIsLoading, korIsLoading]);

  // 상세 페이지에 들어오고 10초 동안은 읽음 처리를 하지 않음 + 한글일 때는 읽음 처리를 하지 않음
  useEffect(() => {
    isActiveRef.current = false;
    let leftTime = 10;
    setScrollProgress(0);

    const startTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        leftTime--;

        if (leftTime <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          if (languageData === "en") {
            isActiveRef.current = true;
            calculateProgress();
          }
        }
      }, 1000);
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, languageData]);

  const calculateProgress = () => {
    if (!isActiveRef.current) {
      return 0;
    }
    // 데이터 fetching이 됐을 때만 calculate
    else if (newsContainerRef.current && !isLoadingRef?.current) {
      const containerRect = newsContainerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;

      // 시작할 때 보여지는 newsContainer 높이
      const initialVisibleHeight = Math.min(
        windowHeight - containerTop,
        containerHeight
      );
      // Calculate how much of the container has been scrolled past
      const scrolledPastContainer = Math.max(0, -containerTop);

      // 총 이동할 수 있는 스크롤 길이
      const totalScrollableDistance = containerHeight - initialVisibleHeight;

      // Calculate overall progress
      let progress;
      if (totalScrollableDistance <= 0) {
        // If the entire container fits in the viewport
        progress = 100;
      } else {
        progress = Math.min(
          ((scrolledPastContainer + initialVisibleHeight) / containerHeight) *
            100,
          100
        );
      }

      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    // 조회수가 여러 번 올라가는 것을 막음
    if (isFirstView) {
      setIsFirstView(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engIsLoading]);

  useEffect(() => {
    if (isRead && isRead[3 - difficulty]) {
      setIsReadFinished(true);
    } else if (scrollProgress === 100) {
      setIsReadFinished(true);
      setIsRead((prevData) => {
        const newState = prevData;
        newState![3 - difficulty] = true;
        return newState;
      });
      readNews(Number(newsId), difficulty);
      setUserProgress((prevProgress) => ({
        ...prevProgress,
        currentReadNewsCount: prevProgress.currentReadNewsCount + 1,
      }));

      // 경험치 모달
      setExpModal({
        isOpen: true,
        experience: 10,
        action: "기사 읽기  ",
      });
      console.log(userProgress);
    } else {
      setIsReadFinished(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollProgress, isRead]);

  // 스크롤, 드래그 이벤트 추가
  useEffect(() => {
    const handleScroll = () => {
      calculateProgress();
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      $isReadFinished={isReadFinished}
      style={{
        width: `${isReadFinished ? 100 : scrollProgress}%`,
      }}
      id="step1"
    />
  );
};

export default ProgressBar;

const Container = styled.div<{ $isReadFinished: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 0.25rem;
  background-color: ${(props) =>
    props.$isReadFinished ? "green" : props.theme.colors.primary};
  z-index: 1000;
  transition: width 0.1s ease-out;
`;
