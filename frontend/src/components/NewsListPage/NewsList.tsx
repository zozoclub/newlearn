import { useEffect } from "react";
import styled from "styled-components";

import NewsListItem from "@components/NewsListPage/NewsListItem";
import { useQuery } from "@tanstack/react-query";
import { getCategoryNewsList, getTotalNewsList } from "@services/newsService";
import { useRecoilValue } from "recoil";
import languageState from "@store/languageState";
import { useParams } from "react-router-dom";
import userInfoState from "@store/userInfoState";
import { NewsListType } from "types/newsType";
import LoadingBar from "@components/common/LoadingBar";
import Spinner from "@components/Spinner";

const NewsList: React.FC<{
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setTotalPages }) => {
  const languageData = useRecoilValue(languageState);
  const { category, page } = useParams();
  const selectedCategory = Number(category);
  const selectedPage = Number(page);
  const { difficulty } = useRecoilValue(userInfoState);

  const { isLoading: totalIsLoading, data: totalNewsList } =
    useQuery<NewsListType>({
      queryKey: ["totalNewsList", selectedCategory, selectedPage, languageData],
      queryFn: () =>
        getTotalNewsList(difficulty, languageData, selectedPage, 10),
      enabled: selectedCategory === 0,
    });

  const { isLoading: categoryIsLoading, data: categoryNewsList } =
    useQuery<NewsListType>({
      queryKey: [
        "categoryNewsList",
        selectedCategory,
        selectedPage,
        languageData,
      ],
      queryFn: () =>
        getCategoryNewsList(
          difficulty,
          languageData,
          selectedPage,
          10,
          selectedCategory
        ),
      enabled: selectedCategory !== 0,
    });

  useEffect(() => {
    if (selectedCategory === 0 && totalNewsList) {
      setTotalPages(totalNewsList?.totalPages);
    } else if (categoryNewsList) {
      setTotalPages(categoryNewsList?.totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryNewsList, selectedCategory, totalNewsList]);

  return (
    <Container id="step9">
      <NewsListContainer>
        {selectedCategory === 0
          ? totalIsLoading
            ? [...Array(5)].map((_, index) => (
                <LoadingDiv key={index}>
                  <ThumbnailImageDiv>
                    <Spinner />
                  </ThumbnailImageDiv>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      width: "70%",
                    }}
                  >
                    <LoadingBar />
                    <div style={{ marginBottom: "1rem" }}>
                      <LoadingBar />
                    </div>
                    <LoadingBar />
                  </div>
                </LoadingDiv>
              ))
            : totalNewsList?.newsList?.map((news) => (
                <NewsListItem key={news.newsId} news={news} />
              ))
          : categoryIsLoading
          ? [...Array(5)].map((_, index) => (
              <LoadingDiv key={index}>
                <ThumbnailImageDiv>
                  <Spinner />
                </ThumbnailImageDiv>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    width: "70%",
                  }}
                >
                  <LoadingBar />
                  <div style={{ marginBottom: "1rem" }}>
                    <LoadingBar />
                  </div>
                  <LoadingBar />
                </div>
              </LoadingDiv>
            ))
          : categoryNewsList?.newsList?.map((news) => (
              <NewsListItem key={news.newsId} news={news} />
            ))}
      </NewsListContainer>
    </Container>
  );
};

const Container = styled.div`
  border-radius: 0.75rem;
`;

const NewsListContainer = styled.div`
  column-gap: 0.5rem;
  @media (max-width: 767px) {
    gap: 0rem;
  }
`;

const LoadingDiv = styled.div`
  display: flex;
  height: 13rem;
  margin: 1rem 0;
  border-radius: 1rem;
  background-color: ${(props) => props.theme.colors.newsItemBackground};
  overflow: hidden;
  transition: background-color 0.5s;
  cursor: pointer;
  box-shadow: ${(props) => props.theme.shadows.small};
  &:hover {
    background-color: ${(props) => props.theme.colors.newsItemBackgroundPress};
  }
  @media screen and (min-width: 768px) {
    padding: 2rem;
  }
  @media screen and (max-width: 1279px) {
    height: 10rem;
  }
  @media (max-width: 767px) {
    height: 100%;
    box-shadow: none;
    border-radius: 2px;
    margin: 0;
    padding: 0.75rem 0.5rem;
    background-color: transparent;
    border-bottom: 1px solid ${(props) => props.theme.colors.readonly};
  }
`;

const ThumbnailImageDiv = styled.div`
  position: relative;
  height: 100%;
  margin-right: 2.5rem;
  @media screen and (min-width: 1280px) {
    min-width: 20rem;
  }
  @media screen and (max-width: 1279px) {
    aspect-ratio: 1.6;
  }
  @media (max-width: 768px) {
    min-width: 7rem;
    height: 4.5rem;
    margin-right: 1rem;
  }
`;
export default NewsList;
