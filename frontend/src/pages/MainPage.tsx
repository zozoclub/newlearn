import Clock from "@components/mainpage/Clock";
import DailyNews from "@components/mainpage/DailyNews";
import Widget from "@components/mainpage/Widget";
import { usePageTransition } from "@hooks/usePageTransition";
import { getOAuthAccessToken } from "@services/userService";
import locationState from "@store/locationState";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const MainPage = () => {
  const setCurrentLocation = useSetRecoilState(locationState);
  const transitionTo = usePageTransition();
  const query = useQuery();
  const widgetList = [
    { variety: "profile" },
    { variety: "chart" },
    { variety: "ranking" },
    { variety: "goal" },
  ];

  useEffect(() => {
    setCurrentLocation("Main Page");
    return () => {
      setCurrentLocation("");
    };
  }, [setCurrentLocation]);

  useEffect(() => {
    const queryCode = query.get("code");

    if (queryCode !== null) {
      const getAccessToken = async () => {
        try {
          const response = await getOAuthAccessToken(queryCode);
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      };

      getAccessToken();
    }
  }, [query, transitionTo]);

  return (
    <Container>
      <NewsContainer>
        <Clock />
        <DailyNews />
      </NewsContainer>
      <WidgetContainer>
        {widgetList.map((widget, index) => (
          <Widget key={index} variety={widget.variety} />
        ))}
      </WidgetContainer>
    </Container>
  );
};

export default MainPage;

const Container = styled.div`
  display: flex;
  position: relative;
  height: 35rem;
  justify-content: space-around;
  padding: 5rem 0;
`;

const NewsContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
`;

const WidgetContainer = styled.div`
  display: grid;
  position: absolute;
  z-index: 1;
  right: 0;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2.5rem;
  width: 40rem;
`;
