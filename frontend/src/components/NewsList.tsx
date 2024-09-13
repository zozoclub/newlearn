import { useState } from "react";
import styled from "styled-components";
import NewsListItem from "./NewsListItem";

const NewsList = () => {
  const [newsList, setNewsList] = useState([
    { title: "누스 타이틀 완" },
    { title: "누스 타이틀 투" },
    { title: "누스 타이틀 쓰리" },
  ]);

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
