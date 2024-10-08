import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LoadingDiv from "../common/LoadingDiv";
import LoadingBar from "../common/LoadingBar";
import { deleteScrapNews, scrapNews } from "@services/newsService";
import { useRecoilValue } from "recoil";
import languageState from "@store/languageState";
import DifficultyToggleBtn from "./DifficultyToggleBtn";
import Bookmark from "./Bookmark";
import { useParams } from "react-router-dom";
import { DetailNewsType } from "types/newsType";
import { useMediaQuery } from "react-responsive";

type NewsHeaderPropsType = {
  engIsLoading: boolean;
  korIsLoading: boolean;
  engData: DetailNewsType | undefined;
  korData: DetailNewsType | undefined;
  difficulty: number;
  setDifficulty: React.Dispatch<React.SetStateAction<number>>;
  isRead: boolean[] | undefined;
  setIsReadFinished: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewsDetailHeader: React.FC<NewsHeaderPropsType> = ({
  engIsLoading,
  korIsLoading,
  engData,
  korData,
  difficulty,
  setDifficulty,
  setIsReadFinished,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { newsId } = useParams();
  const languageData = useRecoilValue(languageState);
  const [isScrapped, setIsScrapped] = useState(false);
  const handleScrap = async () => {
    if (isScrapped) {
      deleteScrapNews(Number(newsId), difficulty).then(() =>
        setIsScrapped(false)
      );
    } else {
      scrapNews(Number(newsId), difficulty).then(() => setIsScrapped(true));
    }
  };

  useEffect(() => {
    if (engData) {
      setIsScrapped(engData.isScrapped);
    }
  }, [engData]);

  const MobileRender = () => {
    return (
      <Container>
        <NewsCategory>
          {engIsLoading || korIsLoading ? (
            <LoadingDiv>
              <LoadingBar />
            </LoadingDiv>
          ) : (
            <>{engData?.category}</>
          )}
        </NewsCategory>
        <NewsTitle>
          {engIsLoading || korIsLoading ? (
            <LoadingDiv>
              <LoadingBar />
            </LoadingDiv>
          ) : (
            <>{languageData === "en" ? engData?.title : korData?.title}</>
          )}
        </NewsTitle>
        {engIsLoading || korIsLoading ? (
          <>
            <LoadingDiv>
              <LoadingBar />
            </LoadingDiv>
          </>
        ) : (
          <DateContainer>
            <NewsDate>
              {languageData === "en"
                ? engData?.publishedDate
                : korData?.publishedDate}
            </NewsDate>
            <SecondaryDiv>
              <div>{engData?.press}</div>
              <div> | </div>
              <div>{engData?.journalist}</div>
              <div>조회 {engData?.hit}</div>
            </SecondaryDiv>
          </DateContainer>
        )}

        <SettingContainer>
          {engIsLoading || korIsLoading ? (
            <div style={{ width: "calc(100% - 20rem)" }}>
              <LoadingDiv>
                <LoadingBar />
              </LoadingDiv>
            </div>
          ) : (
            <OriginalUrlButton
              onClick={() => window.open(`${engData?.originalUrl}`, "_blank")}
            >
              기사원문
            </OriginalUrlButton>
          )}
          <SettingDiv>
            <DifficultyToggleBtn
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              isRead={engData?.isRead[difficulty - 1]}
              setIsReadFinished={setIsReadFinished}
            />
            <BookmarkContainer onClick={handleScrap}>
              <Bookmark isScrapped={isScrapped} />
            </BookmarkContainer>
          </SettingDiv>
        </SettingContainer>
      </Container>
    );
  };

  const DesktopRender = () => {
    return (
      <Container>
        <NewsCategory>
          {engIsLoading || korIsLoading ? (
            <LoadingDiv>
              <LoadingBar />
            </LoadingDiv>
          ) : (
            <>{engData?.category}</>
          )}
        </NewsCategory>
        <NewsTitle>
          {engIsLoading || korIsLoading ? (
            <LoadingDiv>
              <LoadingBar />
            </LoadingDiv>
          ) : (
            <>{languageData === "en" ? engData?.title : korData?.title}</>
          )}
        </NewsTitle>
        {engIsLoading || korIsLoading ? (
          <>
            <LoadingDiv>
              <LoadingBar />
            </LoadingDiv>
          </>
        ) : (
          <DateContainer>
            <NewsDate>
              {languageData === "en"
                ? engData?.publishedDate
                : korData?.publishedDate}
            </NewsDate>
            <OriginalUrlButton
              onClick={() => window.open(`${engData?.originalUrl}`, "_blank")}
            >
              기사원문
            </OriginalUrlButton>
          </DateContainer>
        )}

        <SettingContainer>
          {engIsLoading || korIsLoading ? (
            <div style={{ width: "calc(100% - 20rem)" }}>
              <LoadingDiv>
                <LoadingBar />
              </LoadingDiv>
            </div>
          ) : (
            <SecondaryDiv>
              <div>{engData?.press}</div>
              <div> | </div>
              <div>{engData?.journalist}</div>
              <div>조회 {engData?.hit}</div>
            </SecondaryDiv>
          )}
          <SettingDiv>
            <DifficultyToggleBtn
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              isRead={engData?.isRead[difficulty - 1]}
              setIsReadFinished={setIsReadFinished}
            />
            <BookmarkContainer onClick={handleScrap}>
              <Bookmark isScrapped={isScrapped} />
            </BookmarkContainer>
          </SettingDiv>
        </SettingContainer>
      </Container>
    );
  };

  return isMobile ? <MobileRender /> : <DesktopRender />;
};

export default NewsDetailHeader;

const Container = styled.div`
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
  width: 100%;
  font-size: 1.75rem;
  font-weight: 600;
  @media (max-width: 767px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const NewsDate = styled.div`
  color: ${(props) => props.theme.colors.text03};
  @media (max-width: 767px) {
    font-size: 0.875rem;
    letter-spacing: 0.01rem;
  }
`;

const OriginalUrlButton = styled.button`
  padding: 0.25rem 0.5rem;
  background-color: ${(props) => props.theme.colors.readonly};
  border: 1px solid ${(props) => props.theme.colors.placeholder};
  border-radius: 0.5rem;
  cursor: pointer;
`;

const SecondaryDiv = styled.div`
  display: flex;
  gap: 0.5rem;
  color: ${(props) => props.theme.colors.text03};
  @media (max-width: 767px) {
    font-size: 0.875rem;
    gap: 0.25rem;
  }
`;

const SettingDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  right: 0;
  @media (max-width: 767px) {
    gap: 1.5rem;
  }
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: start;
  }
`;

const SettingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const BookmarkContainer = styled.div`
  display: grid;
  place-items: center;
  @media (max-width: 767px) {
    scale: 0.8;
  }
`;
