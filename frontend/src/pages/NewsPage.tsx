import Recommand from "@components/Recommand";
import NewsListHeader from "@components/NewsListHeader";
import locationState from "@store/locationState";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import NewsList from "@components/NewsList";

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
