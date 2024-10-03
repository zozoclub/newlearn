import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { goalDataSelector } from "@store/goalState";
import CategoryChart from "@components/CategoryChart";
import RankingWidget from "./RankingWidget";
import GoalChartDoughnut from "@components/GoalChartDoughnut";
import MainGoalBar from "@components/mainpage/MainGoalBar";
import { useNavigate } from "react-router-dom";

const Widget: React.FC<{ variety: string }> = ({ variety }) => {
  const navigate = useNavigate();
  const goalData = useRecoilValue(goalDataSelector);
  const handleMyStudy = () => {
    navigate("/mystudy");
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
          {goalData[0].goal && goalData[1].goal && goalData[2].goal ? (
            <>
              <GoalChartDoughnut />
              <MainGoalBar />
            </>
          ) : (
            <>
              <div>아직 학습 목표가 없습니다.</div>
              <GoalSetting onClick={handleMyStudy}>
                학습 목표 설정하기
              </GoalSetting>
            </>
          )}
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

const GoalSetting = styled.button`
  padding: 0.75rem;
  margin-top: 1rem;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
`;
export default Widget;
