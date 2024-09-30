import DifficultyToggleBtn from "@components/newspage/DifficultyToggleBtn";
import LanguageToggleBtn from "@components/newspage/LanguageToggleBtn";
import Spinner from "@components/Spinner";
import { DetailNewsType, getNewsDetail, readNews } from "@services/newsService";
import languageState from "@store/languageState";
import locationState from "@store/locationState";
import userInfoState from "@store/userInfoState";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

const NewsDetailPage = () => {
  const setCurrentLocation = useSetRecoilState(locationState);
  const userInfoData = useRecoilValue(userInfoState);
  const languageData = useRecoilValue(languageState);
  const [difficulty, setDifficulty] = useState<number>(userInfoData.difficulty);
  const [scrollProgress, setScrollProgress] = useState(0);
  const newsContainerRef = useRef<HTMLDivElement>(null);
  const [isReadFinished, setIsReadFinished] = useState<boolean>(false);
  const [isRead, setIsRead] = useState<boolean[] | undefined>([
    false,
    false,
    false,
  ]);
  const [isFirstView, setIsFirstView] = useState<boolean>(true);

  const { newsId } = useParams();
  const { isLoading, data } = useQuery<DetailNewsType>({
    queryKey: ["getNewsDetail", languageData, difficulty, newsId],
    queryFn: () =>
      getNewsDetail(Number(newsId), difficulty, languageData, isFirstView),
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    setCurrentLocation("news Page");
    window.scrollTo(0, 0); // Scroll to top when component mounts
    return () => {
      setCurrentLocation("");
    };
  }, [setCurrentLocation]);

  useEffect(() => {
    setDifficulty(userInfoData.difficulty);
  }, [userInfoData.difficulty]);

  const calculateProgress = () => {
    if (newsContainerRef.current && !isLoading) {
      if (isFirstView) {
        setIsFirstView(false);
      }
      setIsRead(data?.isRead);
      const containerRect = newsContainerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;

      // Calculate how much of the container is initially visible
      const initialVisibleHeight = Math.min(
        windowHeight - containerTop,
        containerHeight
      );
      // Calculate how much of the container has been scrolled past
      const scrolledPastContainer = Math.max(0, -containerTop);

      // Calculate total scrollable distance
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

  const handleScroll = () => {
    calculateProgress();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Calculate initial progress
    calculateProgress();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, difficulty]);

  useEffect(() => {
    if (!isLoading && isRead![3 - difficulty]) {
      setIsRead(data?.isRead);
    }
    if (isRead![3 - difficulty]) {
      setIsReadFinished(true);
      window.removeEventListener("scroll", handleScroll);
    } else if (scrollProgress < 100) {
      // console.log(scrollProgress);
      // console.log(isRead);
      setIsReadFinished(false);
      window.addEventListener("scroll", handleScroll);
    } else if (scrollProgress === 100) {
      setIsReadFinished(true);
      // console.log(difficulty);
      setIsRead((prevState) => {
        if (prevState) {
          const newState = [...prevState];
          newState[3 - difficulty] = true;
          console.log("newState is", newState);
          return newState;
        }
        return prevState;
      });
      console.log(isRead);
      readNews(Number(newsId), difficulty);
      window.removeEventListener("scroll", handleScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollProgress, data?.isRead, difficulty]);

  return (
    <>
      <ProgressBar
        $isReadFinished={isReadFinished}
        style={{ width: `${isReadFinished ? 100 : scrollProgress}%` }}
      />
      <Container>
        <NewsContainer ref={newsContainerRef}>
          <NewsHeader>
            <NewsCategory>
              {isLoading ? (
                <LoadingDiv>
                  <LoadingBar />
                </LoadingDiv>
              ) : (
                <>{data?.category}</>
              )}
            </NewsCategory>
            <NewsTitle>
              {isLoading ? (
                <LoadingDiv>
                  <LoadingBar />
                </LoadingDiv>
              ) : (
                <>{data?.title}</>
              )}
            </NewsTitle>
            {isLoading ? (
              <>
                <LoadingDiv>
                  <LoadingBar />
                </LoadingDiv>
              </>
            ) : (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <NewsDate>{data?.publishedDate}</NewsDate>
                <OriginalUrlButton
                  onClick={() =>
                    (window.location.href = `${data?.originalUrl}`)
                  }
                >
                  기사원문
                </OriginalUrlButton>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              {isLoading ? (
                <LoadingDiv style={{ width: "calc(100% - 20rem)" }}>
                  <LoadingBar />
                </LoadingDiv>
              ) : (
                <>
                  <PressDiv>{data?.press}</PressDiv>
                  <div>|</div>
                  <JournalistDiv>{data?.journalist}</JournalistDiv>
                  <HitDiv>조회 {data?.hit}</HitDiv>
                </>
              )}
              <SettingDiv>
                <LanguageToggleBtn />
                <DifficultyToggleBtn
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  isRead={data?.isRead[difficulty - 1]}
                  setIsReadFinished={setIsReadFinished}
                />
              </SettingDiv>
            </div>
          </NewsHeader>
          <ThumbnailImageDiv>
            {isLoading ? (
              <Spinner />
            ) : (
              <ThumbnailImage src={data?.thumbnailImageUrl} alt="noImage" />
            )}
          </ThumbnailImageDiv>
          <NewsContent>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <LoadingDiv>
                  <LoadingBar />
                </LoadingDiv>
                <LoadingDiv>
                  <LoadingBar />
                </LoadingDiv>
                <LoadingDiv>
                  <LoadingBar />
                </LoadingDiv>
              </div>
            ) : (
              <div>{data?.content}</div>
            )}
          </NewsContent>
        </NewsContainer>
        <RecommandContainer>추천 컨테이너</RecommandContainer>
      </Container>
    </>
  );
};

const ProgressBar = styled.div<{ $isReadFinished: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 0.25rem;
  background-color: ${(props) =>
    props.$isReadFinished ? "green" : props.theme.colors.primary};
  z-index: 1000;
  transition: width 0.1s ease-out;
`;

const Container = styled.div`
  display: flex;
  gap: 2.5%;
  width: 90%;
  height: 85%;
  margin: 0 5%;
  border-radius: 0.75rem;
`;

const NewsContainer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground01};
  border-radius: 0.75rem;
  width: 70%;
  padding: 5%;
`;

const NewsHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const NewsCategory = styled.div`
  width: 5rem;
  color: ${(props) => props.theme.colors.text02};
`;

const NewsTitle = styled.div`
  width: 80%;
  font-size: 1.75rem;
  font-weight: 600;
`;

const NewsDate = styled.div`
  color: ${(props) => props.theme.colors.text03};
`;

const OriginalUrlButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: ${(props) => props.theme.colors.readonly};
  border: 1px solid ${(props) => props.theme.colors.placeholder};
  border-radius: 0.5rem;
  cursor: pointer;
`;

const PressDiv = styled.div``;

const JournalistDiv = styled.div``;

const HitDiv = styled.div`
  color: ${(props) => props.theme.colors.text03};
  margin-left: 0.5rem;
`;

const SettingDiv = styled.div`
  display: flex;
  gap: 2.5rem;
  position: absolute;
  right: 0;
`;

const NewsContent = styled.div`
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin: 1.5rem 0;
`;

const ThumbnailImageDiv = styled.div`
  width: 100%;
  min-height: 400px;
  background-color: ${(props) => props.theme.colors.cardBackground + "AA"};
  border-radius: 0.75rem;
  text-align: center;
`;

const ThumbnailImage = styled.img`
  width: 600px;
  min-height: 400px;
  border-radius: 0.75rem;
`;

const RecommandContainer = styled.div`
  background-color: #1a1925bd;
  border-radius: 0.75rem;
  width: 27.5%;
`;

const LoadingDiv = styled.div`
  position: relative;
  width: 100%;
  height: 0.5rem;
  margin: 0.45rem;
  background-color: ${(props) => props.theme.colors.readonly};
  border-radius: 0.75rem;
  overflow: hidden;
`;

const LoadingBar = styled.div`
  position: absolute;
  height: 0.5rem;
  border-radius: 0.75rem;
  animation: bgmove 1s infinite;
  animation-timing-function: ease;

  @keyframes bgmove {
    0% {
      width: 0;
      background-color: ${(props) => props.theme.colors.placeholder};
    }
    100% {
      width: 100%;
      background-color: ${(props) => props.theme.colors.placeholder};
    }
  }
`;
export default NewsDetailPage;
