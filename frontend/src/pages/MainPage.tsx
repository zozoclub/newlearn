import { PWAInstallPrompt } from "@components/PWAInstallPrompt";
import Clock from "@components/mainpage/Clock";
import DailyNews from "@components/mainpage/DailyNews";
import Widget from "@components/mainpage/Widget";
import locationState from "@store/locationState";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

const MainPage = () => {
  const setCurrentLocation = useSetRecoilState(locationState);
  const widgetList = [
    { variety: "profile" },
    { variety: "chart" },
    { variety: "ranking" },
    { variety: "goal" },
  ];

  useEffect(() => {
    setCurrentLocation("main");
    return () => {
      setCurrentLocation("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <PWAInstallPrompt />
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
