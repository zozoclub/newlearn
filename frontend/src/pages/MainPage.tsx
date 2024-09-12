import Clock from "@components/Clock";
import DailyNews from "@components/DailyNews";
import Widget from "@components/Widget";
import locationState from "@store/state";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  padding: 50px;
  justify-content: space-between;
`;

const NewsContainer = styled.div`
  margin: 0 30px;
`;

const WidgetContainer = styled.div`
  display: grid;
  margin: auto 0;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 240px;
`;

function MainPage() {
  const setCurrentLocation = useSetRecoilState(locationState);
  const widgetList = [
    { variety: "profile" },
    { variety: "chart" },
    { variety: "ranking" },
    { variety: "goal" },
  ];

  useEffect(() => {
    setCurrentLocation("Main Page");
  }, [setCurrentLocation]);

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
}

export default MainPage;
