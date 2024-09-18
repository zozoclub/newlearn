import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";

const TestHistoryPage: React.FC = () => {
  // 페이지 위치 상태 설정
  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("TestHistoryPage");
  }, [setCurrentLocation]);

  return (
    <Layout>
      <LeftContainer>
        <SmallContainer>First</SmallContainer>
        <SmallContainer>Second</SmallContainer>
      </LeftContainer>
      <RightContainer>
        <BigContainer>Third</BigContainer>
      </RightContainer>
    </Layout>
  );
};

export default TestHistoryPage;

const Layout = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
`;

const RightContainer = styled.div`
  display: flex;
  width: 60%;
  align-items: center;
  justify-content: center;
`;

const SmallContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 16rem;
  margin: 0.75rem 0;
  padding: 0.625rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: box-shadow 0.5s;
  width: 100%;
`;

const BigContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 34.5rem;
  margin: 0.75rem 0;
  padding: 0.625rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: box-shadow 0.5s;
  width: 100%;
`;
