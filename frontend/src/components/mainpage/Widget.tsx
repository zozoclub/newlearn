import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { goalDataSelector } from "@store/goalState";
import CategoryChart from "@components/CategoryChart";
import RankingWidget from "./RankingWidget";
import GoalChartDoughnut from "@components/GoalChartDoughnut";
import MainGoalBar from "@components/mainpage/MainGoalBar";

const Widget: React.FC<{ variety: string }> = ({ variety }) => {
  const goalData = useRecoilValue(goalDataSelector);
  console.log(goalData);
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
        <WidgetContainer className="chartt">
          <Descripsion>Learn Category</Descripsion>
          <CategoryChart />
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
          <GoalChartDoughnut />
          <MainGoalBar />
        </WidgetContainer>
      );
  }
};

const WidgetContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 300px;
  height: 300px;

  aspect-ratio: 1;
  background-color: ${(props) => props.theme.colors.cardBackground + "CC"};
  border-radius: 0.75rem;
  transition: box-shadow 0.5s;
  backdrop-filter: blur(4px);
  box-shadow: 0.25rem 0.25rem 0.25rem ${(props) => props.theme.colors.shadow};

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
