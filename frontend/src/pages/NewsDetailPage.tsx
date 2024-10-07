import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import NewsDetailContent from "@components/newspage/NewsDetailContent";
import NewsHeader from "@components/newspage/NewsHeader";
import ProgressBar from "@components/newspage/ProgressBar";
import Spinner from "@components/Spinner";
import { getNewsDetail } from "@services/newsService";
import userInfoState from "@store/userInfoState";
import newsWordState from "@store/newsWordState";
import languageState from "@store/languageState";
import WordHunt from "@components/WordHunt";
import lightThumbnailImage from "@assets/images/lightThumbnail.png";
import darkThumbnailImage from "@assets/images/darkThumbnail.png";
import BackArrow from "@assets/icons/BackArrow";
import { DetailNewsType } from "types/newsType";
import FilteredRecommendNews from "@components/newspage/FilteredRecommendNews";
import RecentReadNews from "@components/newspage/RecentReadNews";

const NewsDetailPage = () => {
  const userInfoData = useRecoilValue(userInfoState);
  const languageData = useRecoilValue(languageState);
  const [difficulty, setDifficulty] = useState<number>(userInfoData.difficulty);
  const newsContainerRef = useRef<HTMLDivElement>(null);
  const [isReadFinished, setIsReadFinished] = useState<boolean>(false);
  const [isRead, setIsRead] = useState<boolean[] | undefined>([
    false,
    false,
    false,
  ]);
  const [isFirstView, setIsFirstView] = useState<boolean>(true);
  const { newsId } = useParams();

  const { isLoading: engIsLoading, data: engData } = useQuery<DetailNewsType>({
    queryKey: ["getEngNewsDetail", difficulty, Number(newsId)],
    queryFn: () => getNewsDetail(Number(newsId), difficulty, "en", isFirstView),
    staleTime: 0,
  });

  const { isLoading: korIsLoading, data: korData } = useQuery<DetailNewsType>({
    queryKey: ["getKorNewsDetail", difficulty, newsId],
    queryFn: () => getNewsDetail(Number(newsId), difficulty, "kr", isFirstView),
    staleTime: 0,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [languageData, difficulty]);

  useEffect(() => {
    setDifficulty(userInfoData.difficulty);
  }, [userInfoData.difficulty]);

  const setNewsWordState = useSetRecoilState(newsWordState);
  useEffect(() => {
    if (engData) {
      setNewsWordState(engData.words);
      setIsRead(engData.isRead);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engData]);

  return (
    <>
      <ProgressBar
        engIsLoading={engIsLoading}
        korIsLoading={korIsLoading}
        difficulty={difficulty}
        isFirstView={isFirstView}
        isRead={isRead}
        isReadFinished={isReadFinished}
        newsContainerRef={newsContainerRef}
        setIsFirstView={setIsFirstView}
        setIsRead={setIsRead}
        setIsReadFinished={setIsReadFinished}
      />
      <Container>
        <News>
          <div style={{ marginBottom: "1.5rem" }}>
            <BackArrow height={30} width={30} />
          </div>
          <NewsContainer ref={newsContainerRef}>
            <NewsHeader
              difficulty={difficulty}
              engData={engData}
              engIsLoading={engIsLoading}
              isRead={isRead}
              korData={korData}
              korIsLoading={korIsLoading}
              setDifficulty={setDifficulty}
              setIsReadFinished={setIsReadFinished}
            />
            <ThumbnailImageDiv>
              {korIsLoading || engIsLoading ? (
                <Spinner />
              ) : engData?.thumbnailImageUrl ? (
                <ThumbnailImage src={engData?.thumbnailImageUrl} alt="" />
              ) : (
                <>
                  <ThumbnailImage src={lightThumbnailImage} />
                  <DarkThumbnailImage src={darkThumbnailImage} />
                </>
              )}
            </ThumbnailImageDiv>
            <div ref={newsContainerRef}>
              <NewsDetailContent
                difficulty={difficulty}
                engData={engData}
                engIsLoading={engIsLoading}
                korData={korData}
                korIsLoading={korIsLoading}
                newsId={Number(newsId)}
              />
            </div>
          </NewsContainer>
          <div>
            <WordHunt engData={engData?.content} />
          </div>
        </News>
        <SubContainer>
          <FilteredRecommendNews />
          <RecentReadNews />
        </SubContainer>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  gap: 2.5%;
  width: 90%;
  height: 85%;
  margin: 0 5%;
  border-radius: 0.75rem;
  overflow: hidden;
  @media (max-width: 1279px) {
    flex-direction: column;
    margin-bottom: 15rem;
  }
`;

const News = styled.div`
  position: relative;
  width: 65%;
  margin-bottom: 2.5%;
  padding: 2.5% 5%;
  border-radius: 0.75rem;
  background-color: ${(props) => props.theme.colors.cardBackground01};
  letter-spacing: 0.5px;
  word-spacing: 0.5px;
  @media (max-width: 1279px) {
    width: 90%;
  }
  @media (max-width: 767px) {
    width: 100%;
    padding: 5% 0;
    background-color: transparent;
  }
`;

const NewsContainer = styled.div``;

const ThumbnailImageDiv = styled.div`
  position: relative;
  width: 100%;
  min-height: 300px;
  background-color: ${(props) => props.theme.colors.cardBackground + "AA"};
  border-radius: 0.75rem;
  text-align: center;
`;

const ThumbnailImage = styled.img`
  width: 75%;
  min-height: 300px;
  border-radius: 0.75rem;
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;
const DarkThumbnailImage = styled(ThumbnailImage)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  opacity: ${(props) => (props.theme.mode === "dark" ? 1 : 0)};
  transition: opacity 0.3s;
`;

const SubContainer = styled.div`
  width: 30%;
  padding: 0 0 2% 0;
  .header {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    padding: 0.5rem;
  }
  .recommand-news {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .recent-news {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .news-div {
    display: flex;
    border-radius: 0.5rem;
    padding: 0.5rem;
    background-color: ${(props) =>
      props.theme.mode === "dark" ? "transparent" : "#ffffffaa"};
    backdrop-filter: blur(10px);
    border: 2px solid
      ${(props) => (props.theme.mode === "dark" ? "#1a1a1aaa" : "#e2e2e2aa")};
    cursor: pointer;
    transform: translateY(0rem);
    transition: background-color 0.3s, transform 0.3s, border 0.3s,
      backdrop-filter 0.3s;
    &:hover {
      background-color: ${(props) =>
        props.theme.mode === "dark"
          ? props.theme.colors.cardBackground01
          : "transparent"};
      transform: translateY(-0.25rem);
    }
  }
  .content-div {
    width: 52.5%;
    padding: 0 2.5% 0 0;
    font-size: 1.125rem;
    line-height: 1.25rem;
    height: 3.75rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  .thumbnail-div {
    position: relative;
    width: 45%;
    aspect-ratio: 1.6;
    img {
      width: 100%;
      aspect-ratio: 1.6;
      object-fit: cover;
      border-radius: 0.5rem;
    }
  }
  @media (max-width: 1279px) {
    width: 98%;
    .content-div {
      width: 67.5%;
    }
    .thumbnail-div {
      width: 30%;
    }
  }
`;

export default NewsDetailPage;
