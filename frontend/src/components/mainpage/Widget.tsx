import styled from "styled-components";
// import CategoryChart from "@components/CategoryChart";
import TopRankingWidget, {
  PointRankingType,
  ReadRankingType,
} from "./TopRankingWidget";
import MainGoalBar from "@components/mainpage/MainGoalBar";
import { useNavigate } from "react-router-dom";
// import RankingWidget from "./RankingWidget";
import { useQuery } from "@tanstack/react-query";
import {
  getPointRankingList,
  getReadRankingList,
} from "@services/rankingService";
import { useRecoilValue } from "recoil";
import { goalDataSelector } from "@store/goalState";
import CategoryChart from "@components/CategoryChart";

const Widget: React.FC<{ variety: string }> = ({ variety }) => {
  const { isLoading: pointIsLoading, data: pointRankingList } = useQuery<
    PointRankingType[]
  >({
    queryKey: ["pointRankingData"],
    queryFn: getPointRankingList,
    staleTime: 5 * 60 * 1000,
  });
  const { isLoading: readIsLoading, data: readRankingList } = useQuery<
    ReadRankingType[]
  >({
    queryKey: ["readRankingList"],
    queryFn: getReadRankingList,
    staleTime: 5 * 60 * 1000,
  });
  const navigate = useNavigate();
  const goalData = useRecoilValue(goalDataSelector);
  const handleMyStudy = () => {
    navigate("/mystudy");
  };
  switch (variety) {
    case "profile":
      return <WidgetContainer></WidgetContainer>;
    case "chart":
      return (
        <WidgetContainer className="chart">
          <CategoryChart />
        </WidgetContainer>
      );
    case "topRanking":
      return (
        <LargeWidgetContainer>
          <TopRankingWidget
            pointIsLoading={pointIsLoading}
            pointRankingList={pointRankingList}
            readIsLoading={readIsLoading}
            readRankingList={readRankingList}
          />
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
  height: 300px;
  padding: 2.5%;

  aspect-ratio: 1;
  background-color: ${(props) => props.theme.colors.cardBackground01};
  border-radius: 1rem;
  transition: box-shadow 0.5s;
  backdrop-filter: blur(12px);
  box-shadow: ${(props) => props.theme.shadows.xsmall};
`;

const LargeWidgetContainer = styled(WidgetContainer)`
  aspect-ratio: 2.12;
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
