import React from "react";
import ContributionGraph from "@components/ContributionGraph";
import styled from "styled-components";
import { GrassType, getUserGrass } from "@services/mypageService";
import { useQuery } from "@tanstack/react-query";

const MyPageGrass = () => {
  const currentYear = new Date().getFullYear();

  const { data: grassData = [] } = useQuery<GrassType[]>({
    queryKey: ["userGrass"],
    queryFn: getUserGrass,
  });

  const totalNews = React.useMemo(() => {
    return grassData.reduce((sum, item) => {
      const itemYear = new Date(item.date).getFullYear();
      return itemYear === currentYear ? sum + item.count : sum;
    }, 0);
  }, [grassData, currentYear]);

  // 현재 년도 필터
  const currentYearData = React.useMemo(() => {
    return grassData.filter(
      (item) => new Date(item.date).getFullYear() === currentYear
    );
  }, [grassData, currentYear]);
  return (
    <div>
      <TitleContainer>
        <YearContainer>{new Date().getFullYear()}</YearContainer>
        <NewsContainer>
          <TotalContainer>{totalNews}</TotalContainer>
          <ContentContainer>NEWS!</ContentContainer>
        </NewsContainer>
      </TitleContainer>
      <ContributionGraph data={currentYearData} />
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
