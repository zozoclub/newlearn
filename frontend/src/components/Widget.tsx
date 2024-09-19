import styled from "styled-components";
import PuzzleIcon from "@assets/icons/puzzleIcon.png";
import CategoryChart from "./CategoryChart";

type CountDataKey =
  | "economyCount"
  | "politicsCount"
  | "societyCount"
  | "cultureCount"
  | "scienceCount"
  | "entertainCount";

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
    entertainCount: 7,
  };

  switch (variety) {
    case "profile":
      return (
        <Container>
          <Descripsion>My Information</Descripsion>
          <ProfileImage persentage={25}>
            <img src={PuzzleIcon} />
          </ProfileImage>
          <div>Lv.32 Coding Larva</div>
          <ReadStatus>
            <div>
              <div>Read</div>
              <div>20</div>
            </div>
            <div>
              <div>Speak</div>
              <div>32</div>
            </div>
            <div>
              <div>Scrap</div>
              <div>17</div>
            </div>
          </ReadStatus>
        </Container>
      );
    case "chart":
      return (
        <Container>
          <Descripsion>Learn Category</Descripsion>
          <CategoryChart countData={countData} height={260} />
        </Container>
      );
    case "ranking":
      return (
        <Container>
          <Descripsion>Ranking</Descripsion>
        </Container>
      );
    case "goal":
      return (
        <Container>
          <Descripsion>study goal</Descripsion>
        </Container>
      );
  }
};

const Container = styled.div`
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
`;

const Descripsion = styled.div`
  position: absolute;
  top: -1.5rem;
  left: 0.25rem;
  font-size: 0.875rem;
`;

const ProfileImage = styled.div<{ persentage: number }>`
  position: relative;
  border-radius: 100%;
  width: 50%;
  height: 50%;
  margin: 1rem 0 0.5rem 0;
  background: conic-gradient(
    ${(props) => props.theme.colors.primary} 0% ${(props) => props.persentage}%,
    transparent 25% 100%
  );
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    transform: translate(-50%, -50%);
    border-radius: 100%;
    background-color: #ffffff;
  }
`;

const ReadStatus = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 4rem);
  margin: 1rem 2rem;
  div {
    text-align: center;
    :first-child {
      margin: 0.75rem 0 0.75rem 0;
    }
  }
`;

export default Widget;
