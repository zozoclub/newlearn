import styled from "styled-components";
import MainGoalBar from "@components/mainpage/MainGoalBar";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { goalDataSelector } from "@store/goalState";
import CategoryChart from "@components/CategoryChart";
import RankingWidget from "./RankingWidget";
import TopRanking from "./TopRanking";

const Widget: React.FC<{ variety: string }> = ({ variety }) => {
  const navigate = useNavigate();
  const goalData = useRecoilValue(goalDataSelector);
  const handleMyStudy = () => {
    navigate("/mystudy");
  };
  switch (variety) {
    case "chart":
      return (
        <WidgetContainer id="step4" className="chart">
          <CategoryChart />
        </WidgetContainer>
      );
    case "ranking":
      return (
        <LargeWidgetContainer id="step5">
          <RankingWidget />
        </LargeWidgetContainer>
      );
    case "goal":
      return (
        <WidgetContainer id="step3">
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
    case "topRanking":
      return (
        <WidgetContainer>
          <TopRanking />
        </WidgetContainer>
      );
  }
};

const WidgetContainer = styled.div`
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
  @media screen and (min-width: 768px) and (max-width: 1279px) {
    min-width: 14.5rem;
  }
`;

const LargeWidgetContainer = styled(WidgetContainer)`
  grid-column: span 2;
  aspect-ratio: 2;
  @media screen and (min-width: 768px) and (max-width: 1279px) {
    grid-column: span 1;
    min-height: 14.5rem;
  }
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
