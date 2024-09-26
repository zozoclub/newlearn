import { useEffect, useState } from "react";
import styled from "styled-components";

import NewsListItem from "@components/newsPage/NewsListItem";

const NewsList: React.FC<{ selectedCategory: number }> = ({
  selectedCategory,
}) => {
  const [newsList, setNewsList] = useState([
    { title: "누스 타이틀 완" },
    { title: "누스 타이틀 투" },
    { title: "누스 타이틀 쓰리" },
  ]);
  console.log(setNewsList);

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
      <div>뉴스 리스트</div>
      <NewsListContainer>
        {newsList.map((news) => (
          <NewsListItem title={news.title} />
        ))}
      </NewsListContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: green;
  border-radius: 0.75rem;
`;

const NewsListContainer = styled.div`
  column-gap: 0.5rem;
`;

export default NewsList;
