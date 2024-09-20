import ContributionGraph from "@components/ContributionGraph";
import styled from "styled-components";

const generateContributionData = () => {
  const startDate = new Date(2024, 2, 25);
  const endDate = new Date(2024, 8, 16);
  const data = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    data.push({
      date: new Date(d),
      count: Math.floor(Math.random() * 21),
    });
  }

  return data;
};

const MyPageGrass = () => {
  // 임시 데이터 생성
  const data = generateContributionData();
  const totalNews = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div>
      <TitleContainer>
        <YearContainer>{new Date().getFullYear()}</YearContainer>
        <NewsContainer>
          <TotalContainer>{totalNews}</TotalContainer>
          <ContentContainer>NEWS!</ContentContainer>
        </NewsContainer>
      </TitleContainer>
      <ContributionGraph data={data} />
    </div>
  );
};

export default MyPageGrass;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const YearContainer = styled.div`
  font-weight: bold;
  font-size: 1.75rem;
`;

const NewsContainer = styled.div`
  display: flex;
  align-items: center;
`;
const TotalContainer = styled.div`
  color: ${(props) => props.theme.colors.primaryPress};
  font-weight: bold;
  font-size: 1.5rem;
`;

const ContentContainer = styled.div`
  margin-left: 0.5rem;
  font-size: 1.25rem;
`;
