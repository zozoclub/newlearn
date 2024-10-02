import { useState } from "react";
import styled from "styled-components";

import Recommand from "@components/newspage/Recommand";
import NewsListHeader from "@components/newspage/NewsListHeader";
import NewsList from "@components/newspage/NewsList";

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <Container>
      <NewsListHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <NewsContent>
        {selectedCategory === 0 && <Recommand />}
        <NewsList selectedCategory={selectedCategory} />
      </NewsContent>
    </Container>
  );
};

const Container = styled.div`
  width: 80%;
  height: 85%;
  margin: 0 5%;
  padding: 2.5% 5%;
  background-color: ${(props) => props.theme.colors.cardBackground};
  border-radius: 0.5rem;
  overflow: scroll;
`;

const NewsContent = styled.div`
  padding: 2.5% 0;
`;

export default NewsPage;
