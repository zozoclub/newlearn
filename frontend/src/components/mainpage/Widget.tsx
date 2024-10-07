import styled from "styled-components";
import MainGoalBar from "@components/mainpage/MainGoalBar";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { goalDataSelector } from "@store/goalState";
import CategoryChart from "@components/CategoryChart";
import RankingWidget from "./RankingWidget";

const Widget: React.FC<{ variety: string }> = ({ variety }) => {
  const navigate = useNavigate();
  const goalData = useRecoilValue(goalDataSelector);
  const handleMyStudy = () => {
    navigate("/mystudy");
  };
  switch (variety) {
    case "chart":
      return (
        <WidgetContainer className="chart">
          <CategoryChart />
        </WidgetContainer>
      );
    case "ranking":
      return (
        <LargeWidgetContainer>
          <RankingWidget />
        </LargeWidgetContainer>
      );
    case "goal":
      return (
        <WidgetContainer>
          {goalData[0].goal && goalData[1].goal && goalData[2].goal ? (
            <>
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
  aspect-ratio: 1;
  background-color: ${(props) => props.theme.colors.cardBackground01};
  border-radius: 1rem;
  transition: box-shadow 0.5s;
  backdrop-filter: blur(12px);
  box-shadow: ${(props) => props.theme.shadows.xsmall};
`;

const LargeWidgetContainer = styled(WidgetContainer)`
  grid-column: span 2;
  aspect-ratio: 2;
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
