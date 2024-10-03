import styled from "styled-components";
import { useRecoilValue } from "recoil";

import { goalDataSelector } from "@store/goalState";
import userInfoState from "@store/userInfoState";
import GoalChartDoughnut from "@components/GoalChartDoughnut";
import GoalChartBar from "@components/GoalChartBar";

const GoalChart: React.FC = () => {
  const userInfo = useRecoilValue(userInfoState);
  const goalData = useRecoilValue(goalDataSelector);
  const nickname = userInfo.nickname;

  return (
    <Container>
      <ChartContainer>
        <TitleContainer>
          <NicknameContainer>{nickname}</NicknameContainer> 님의 학습 현황
        </TitleContainer>
        <GoalChartDoughnut />
      </ChartContainer>

      {goalData.map((item, index) => (
        <GoalChartBar
          key={index}
          title={item.title}
          current={item.current}
          goal={item.goal}
          percentage={(item.current / item.goal) * 100}
        />
      ))}
    </Container>
  );
};

export default GoalChart;

const Container = styled.div`
  width: 400px;
`;
const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0 2rem;
  font-size: 1.25rem;
`;

const NicknameContainer = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;
