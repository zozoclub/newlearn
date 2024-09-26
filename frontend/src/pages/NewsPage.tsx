import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import Recommand from "@components/newsPage/Recommand";
import NewsListHeader from "@components/newsPage/NewsListHeader";
import locationState from "@store/locationState";
import NewsList from "@components/newsPage/NewsList";

const NewsPage = () => {
  const setCurrentLocation = useSetRecoilState(locationState);
  const [selectedCategory, setSelectedCategory] = useState(0);

  useEffect(() => {
    setCurrentLocation("news Page");
    return () => {
      setCurrentLocation("");
    };
  }, [setCurrentLocation]);

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
