import { DetailNewsType, readNews } from "@services/newsService";
import { RefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const ProgressBar: React.FC<{
  engIsLoading: boolean;
  korIsLoading: boolean;
  isFirstView: boolean;
  setIsFirstView: React.Dispatch<React.SetStateAction<boolean>>;
  isRead: boolean[] | undefined;
  setIsRead: React.Dispatch<React.SetStateAction<boolean[] | undefined>>;
  engData: DetailNewsType | undefined;
  difficulty: number;
  isReadFinished: boolean;
  setIsReadFinished: React.Dispatch<React.SetStateAction<boolean>>;
  newsId: number;
  newsContainerRef: RefObject<HTMLDivElement>;
}> = ({
  engIsLoading,
  korIsLoading,
  isFirstView,
  setIsFirstView,
  isRead,
  setIsRead,
  engData,
  difficulty,
  isReadFinished,
  setIsReadFinished,
  newsId,
  newsContainerRef,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const isLoadingRef = useRef<boolean>(engIsLoading || korIsLoading);

  useEffect(() => {
    isLoadingRef.current = engIsLoading || korIsLoading;
  }, [engIsLoading, korIsLoading]);

  const calculateProgress = () => {
    // 데이터 fetching이 됐을 때만 calculate
    if (newsContainerRef.current && !isLoadingRef?.current) {
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
      const totalScrollableDistance = containerHeight - windowHeight;

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

  // 데이터 fetching이 끝나면 progress 계산
  useEffect(() => {
    if (!engIsLoading && !korIsLoading) {
      // 조회수가 여러 번 올라가는 것을 막음
      if (isFirstView) {
        setIsFirstView(false);
      }
      setIsRead(engData?.isRead);
      if (!isRead![difficulty - 1]) {
        calculateProgress();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engIsLoading, korIsLoading]);

  // 난이도가 바뀌면 progress 다시 계산
  useEffect(() => {
    calculateProgress();
    if (isRead && !isRead![3 - difficulty]) {
      setIsReadFinished(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, isRead, setIsReadFinished]);

  useEffect(() => {
    if (isRead && isRead[3 - difficulty] && !engIsLoading && !korIsLoading) {
      setIsReadFinished(true);
    } else if (scrollProgress === 100) {
      setIsReadFinished(true);
      setIsRead((prevData) => {
        const newState = prevData;
        newState![3 - difficulty] = true;
        return newState;
      });
      readNews(Number(newsId), difficulty);
    } else {
      setIsReadFinished(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollProgress]);

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
