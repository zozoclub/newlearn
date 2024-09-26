import { useState } from "react";
import styled from "styled-components";

const RankingWidget = () => {
  const [selectedType, setSelectedType] = useState<"point" | "read">("point");
  return (
    <Container>
      <RankingTypeContainer $type={selectedType}>
        <RankingType
          $isSelected={selectedType === "point"}
          $type={"point"}
          onClick={() => setSelectedType("point")}
        >
          포인트왕
        </RankingType>
        <RankingType
          $isSelected={selectedType === "read"}
          $type={"read"}
          onClick={() => setSelectedType("read")}
        >
          다독왕
        </RankingType>
      </RankingTypeContainer>
      <MyRanking>
        <div>My Rank</div>
        <div>몇등이지</div>
      </MyRanking>
      <TopRanking>
        <table width="100%">
          <tr>
            <th style={{ textAlign: "start" }}>등수</th>
            <th>닉네임</th>
            <th>읽은 수</th>
          </tr>
          <tr style={{ textAlign: "center" }}>
            <td style={{ textAlign: "start" }}>1</td>
            <td>닉네임</td>
            <td>300</td>
          </tr>
        </table>
      </TopRanking>
    </Container>
  );
};

const Container = styled.div`
  width: 90%;
  height: 90%;
  padding: 5%;
`;

const RankingTypeContainer = styled.div<{ $type: "point" | "read" }>`
  position: relative;
  width: 10rem;
  height: 1rem;
  margin: auto;
  padding: 0.5rem 2rem;
  color: white;
  border-radius: 1rem;
  box-shadow: gray 0px 0px 2px 2px inset;
  background-color: white;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    transform: ${(props) =>
      props.$type === "point" ? "translateX(0)" : "translateX(6.5rem)"};
    transition: transform 0.5s;
    top: 0;
    left: 0;
    border-radius: 1rem;
    background-color: ${(props) => props.theme.colors.primary};
    width: 5.5rem;
    height: 1rem;
    padding: 0.5rem 1rem;
  }
`;

const RankingType = styled.div<{
  $isSelected: boolean;
  $type: "point" | "read";
}>`
  position: absolute;
  z-index: 1;
  width: 5.5rem;
  height: 1rem;
  padding: 0.5rem 1rem;
  transform: translate(0, -50%);
  color: ${(props) => (props.$isSelected ? "white" : "black")};
  transition: color 0.5s;
  text-align: center;
  top: 50%;
  left: ${(props) => (props.$type === "point" ? 0 : "6.5rem")};
`;

const MyRanking = styled.div`
  display: flex;
  justify-content: space-between;
  width: 8rem;
  margin: 1rem auto;
`;

const TopRanking = styled.div``;

export default RankingWidget;
