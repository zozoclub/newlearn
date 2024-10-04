import { useEffect } from "react";
import styled from "styled-components";

import NewsListItem from "@components/newspage/NewsListItem";
import { useQuery } from "@tanstack/react-query";
import {
  getCategoryNewsList,
  getTotalNewsList,
  NewsListType,
} from "@services/newsService";
import { useRecoilValue } from "recoil";
import languageState from "@store/languageState";
import { useParams } from "react-router-dom";
import userInfoState from "@store/userInfoState";

const NewsList: React.FC<{
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setTotalPages }) => {
  const languageData = useRecoilValue(languageState);
  const { category, page } = useParams();
  const selectedCategory = Number(category);
  const selectedPage = Number(page);
  const userInfoData = useRecoilValue(userInfoState);
  const userDifficulty = userInfoData.difficulty;

  const { data: totalNewsList } = useQuery<NewsListType>({
    queryKey: ["totalNewsList", selectedCategory, selectedPage, languageData],
    queryFn: () =>
      getTotalNewsList(userDifficulty, languageData, selectedPage, 10),
    enabled: selectedCategory === 0,
  });

  const { data: categoryNewsList } = useQuery<NewsListType>({
    queryKey: ["categoryNewsList", selectedCategory, selectedPage],
    queryFn: () =>
      getCategoryNewsList(
        userDifficulty,
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalNewsList, categoryNewsList]);

  useEffect(() => {
    switch (selectedCategory) {
      case 0:
        console.log("전체 선택");
        break;
      case 1:
        console.log("정치 선택");
        break;
      case 2:
        console.log("경제 선택");
        break;
      case 3:
        console.log("사회 선택");
        break;
      case 4:
        console.log("생활/문화 선택");
        break;
      case 5:
        console.log("IT/과학 선택");
        break;
      case 6:
        console.log("세계 선택");
        break;
    }
  }, [selectedCategory]);

  return (
    <Container>
      <NewsListContainer>
        {selectedCategory === 0
          ? totalNewsList?.newsList?.map((news) => (
              <NewsListItem key={news.newsId} news={news} />
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
`;

export default NewsList;
