import NewsListHeader from "@components/NewsListHeader";
import locationState from "@store/locationState";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

const NewsPage = () => {
  const setCurrentLocation = useSetRecoilState(locationState);

  useEffect(() => {
    setCurrentLocation("news Page");
  }, [setCurrentLocation]);

  return (
    <Container>
      <NewsListHeader />
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  height: 90%;
  margin: 0 5%;
  background-color: ${(props) => props.theme.colors.cardBackground};
  border-radius: 0.5rem;
`;

export default NewsPage;
