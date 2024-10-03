import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import NewsDetailContent from "@components/newspage/NewsDetailContent";
import NewsHeader from "@components/newspage/NewsHeader";
import ProgressBar from "@components/newspage/ProgressBar";
import Spinner from "@components/Spinner";
import { DetailNewsType, getNewsDetail } from "@services/newsService";
import userInfoState from "@store/userInfoState";
import newsWordState from "@store/newsWordState";

const NewsDetailPage: React.FC = () => {
  const userInfoData = useRecoilValue(userInfoState);
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
    queryKey: ["getEngNewsDetail", difficulty, newsId],
    queryFn: () => getNewsDetail(Number(newsId), difficulty, "en", isFirstView),
    staleTime: 0,
  });

  const { isLoading: korIsLoading, data: korData } = useQuery<DetailNewsType>({
    queryKey: ["getKorNewsDetail", difficulty, newsId],
    queryFn: () => getNewsDetail(Number(newsId), difficulty, "kr", isFirstView),
    staleTime: 0,
  });

  const [selectedKorContent, setSelectedKorContent] = useState<string>("");

  useEffect(() => {
    if (korData?.content) {
      setSelectedKorContent(korData.content);
    }
  }, [korData]);

  useEffect(() => {
    setDifficulty(userInfoData.difficulty);
  }, [userInfoData.difficulty]);

  const setNewsWordState = useSetRecoilState(newsWordState);
  useEffect(() => {
    if (engData) {
      setNewsWordState(engData.words);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engData]);

  return (
    <>
      <ProgressBar
        engIsLoading={engIsLoading}
        korIsLoading={korIsLoading}
        difficulty={difficulty}
        engData={engData}
        isFirstView={isFirstView}
        isRead={isRead}
        isReadFinished={isReadFinished}
        newsContainerRef={newsContainerRef}
        newsId={Number(newsId)}
        setIsFirstView={setIsFirstView}
        setIsRead={setIsRead}
        setIsReadFinished={setIsReadFinished}
      />
      <Container>
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
            ) : (
              <ThumbnailImage src={engData?.thumbnailImageUrl} alt="noImage" />
            )}
          </ThumbnailImageDiv>
          <NewsDetailContent
            difficulty={difficulty}
            engData={engData}
            engIsLoading={engIsLoading}
            korData={korData}
            korIsLoading={korIsLoading}
            newsId={Number(newsId)}
            selectedKorContent={selectedKorContent}
          />
        </NewsContainer>
        <RecommandContainer>추천 컨테이너</RecommandContainer>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  gap: 2.5%;
  width: 80%;
  height: 85%;
  margin: 0 10%;
  border-radius: 0.75rem;
`;

const NewsContainer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground01};
  border-radius: 0.75rem;
  width: 70%;
  padding: 5%;
`;

const ThumbnailImageDiv = styled.div`
  width: 100%;
  min-height: 400px;
  height: 400px;
  background-color: ${(props) => props.theme.colors.cardBackground + "AA"};
  border-radius: 0.75rem;
  text-align: center;
`;

const ThumbnailImage = styled.img`
  width: 600px;
  min-height: 400px;
  height: 400px;
  border-radius: 0.75rem;
`;

const RecommandContainer = styled.div`
  background-color: #1a1925bd;
  border-radius: 0.75rem;
  width: 27.5%;
`;

export default NewsDetailPage;
