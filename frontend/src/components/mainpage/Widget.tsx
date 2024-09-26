import styled from "styled-components";

import CategoryChart from "@components/CategoryChart";
import RankingWidget from "./RankingWidget";

type CountDataKey =
  | "economyCount"
  | "politicsCount"
  | "societyCount"
  | "cultureCount"
  | "scienceCount"
  | "globalCount";

type CountData = {
  [K in CountDataKey]: number;
};

const Widget: React.FC<{ variety: string }> = ({ variety }) => {
  const countData: CountData = {
    economyCount: 7,
    politicsCount: 12,
    societyCount: 4,
    cultureCount: 16,
    scienceCount: 3,
    globalCount: 7,
  };

  switch (variety) {
    // 다른 걸로 대체 예정
    case "profile":
      return (
        <WidgetContainer>
          <Descripsion>My Information</Descripsion>
        </WidgetContainer>
      );
    case "chart":
      return (
        <WidgetContainer>
          <Descripsion>Learn Category</Descripsion>
          <CategoryChart countData={countData} />
        </WidgetContainer>
      );
    case "ranking":
      return (
        <WidgetContainer>
          <Descripsion>Ranking</Descripsion>
          <RankingWidget />
        </WidgetContainer>
      );
    case "goal":
      return (
        <WidgetContainer>
          <Descripsion>study goal</Descripsion>
        </WidgetContainer>
      );
  }
};

const WidgetContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  aspect-ratio: 1;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  border-radius: 0.75rem;
  transition: box-shadow 0.5s;
  backdrop-filter: blur(4px);
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  .middle-space {
    width: 10rem;
    margin: 0 1rem;
  }
`;

const Descripsion = styled.div`
  position: absolute;
  top: -1.5rem;
  left: 0.25rem;
  font-size: 0.875rem;
`;

export default Widget;
