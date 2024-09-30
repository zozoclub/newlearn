import { useEffect } from "react";
import styled from "styled-components";

import NewsListItem from "@components/newspage/NewsListItem";
import { useQuery } from "@tanstack/react-query";
import {
  getCategoryNewsList,
  getTotalNewsList,
  NewsType,
} from "@services/newsService";
import { useRecoilValue } from "recoil";
import languageState from "@store/languageState";

const NewsList: React.FC<{ selectedCategory: number }> = ({
  selectedCategory,
}) => {
  const languageData = useRecoilValue(languageState);
  const { data: totalNewsList } = useQuery<NewsType[]>({
    queryKey: ["totalNewsList"],
    queryFn: () => getTotalNewsList(2, languageData, 0, 20),
    enabled: selectedCategory === 0,
  });

  const { data: categoryNewsList } = useQuery<NewsType[]>({
    queryKey: ["categoryNewsList", selectedCategory],
    queryFn: () =>
      getCategoryNewsList(1, languageData, 1, 20, selectedCategory),
    enabled: selectedCategory !== 0,
  });

  useEffect(() => {
    switch (selectedCategory) {
      case 0:
        console.log("전체 선택");
        break;
      case 1:
        console.log("경제 선택");
        break;
      case 2:
        console.log("사회 선택");
        break;
      case 3:
        console.log("연예 선택");
        break;
      case 4:
        console.log("IT/과학 선택");
        break;
      case 5:
        console.log("몰라 선택");
        break;
    }
  }, [selectedCategory]);

  return (
    <Container>
      <NewsListContainer>
        {selectedCategory === 0
          ? totalNewsList?.map((news) => (
              <NewsListItem key={news.newsId} news={news} />
            ))
          : categoryNewsList?.map((news) => (
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
