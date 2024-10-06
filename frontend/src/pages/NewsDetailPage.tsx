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
        <FilteredRecommendNews />
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

export default NewsDetailPage;
