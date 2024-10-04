import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LoadingDiv from "./LoadingDiv";
import LoadingBar from "./LoadingBar";
import {
  deleteScrapNews,
  DetailNewsType,
  scrapNews,
} from "@services/newsService";
import { useRecoilValue } from "recoil";
import languageState from "@store/languageState";
import LanguageToggleBtn from "./LanguageToggleBtn";
import DifficultyToggleBtn from "./DifficultyToggleBtn";
import Bookmark from "./Bookmark";
import { useParams } from "react-router-dom";

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

const NewsHeader: React.FC<NewsHeaderPropsType> = ({
  engIsLoading,
  korIsLoading,
  engData,
  korData,
  difficulty,
  setDifficulty,
  setIsReadFinished,
}) => {
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
    if (engData && engData.isScrapped) {
      setIsScrapped(true);
    }
  }, [engData]);

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
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <NewsDate>
            {languageData === "en"
              ? engData?.publishedDate
              : korData?.publishedDate}
          </NewsDate>
          <OriginalUrlButton
            onClick={() => (window.location.href = `${engData?.originalUrl}`)}
          >
            기사원문
          </OriginalUrlButton>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          gap: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        {engIsLoading || korIsLoading ? (
          <div style={{ width: "calc(100% - 20rem)" }}>
            <LoadingDiv>
              <LoadingBar />
            </LoadingDiv>
          </div>
        ) : (
          <SecondaryDiv>
            <div>{engData?.press}</div>
            <div>|</div>
            <div>{engData?.journalist}</div>
            <div>조회 {engData?.hit}</div>
          </SecondaryDiv>
        )}
        <SettingDiv>
          <LanguageToggleBtn />
          <DifficultyToggleBtn
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            isRead={engData?.isRead[difficulty - 1]}
            setIsReadFinished={setIsReadFinished}
          />
          <div
            style={{ display: "grid", placeItems: "center" }}
            onClick={handleScrap}
          >
            <Bookmark isScrapped={isScrapped} />
          </div>
        </SettingDiv>
      </div>
    </Container>
  );
};

export default NewsHeader;

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

const SecondaryDiv = styled.div`
  display: flex;
  gap: 0.5rem;
  color: ${(props) => props.theme.colors.text03};
`;

const SettingDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  right: 0;
`;
