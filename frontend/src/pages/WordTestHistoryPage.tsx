import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  MemorizeWordListResponseDto,
  getMemorizeWordList,
} from "@services/wordMemorize";
import StartWordTestWidget from "@components/testpage/StartWordTestWidget";
import WordTestHistory from "@components/testpage/WordTestHistory";
import { useMediaQuery } from "react-responsive";
import HeaderMobile from "@components/common/HeaderMobile";
import BackArrow from "@assets/icons/BackArrow";

type Word = {
  id: string;
  title: string;
  content: string;
};

const WordTestHistoryPage: React.FC = () => {
  const setCurrentLocationData = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocationData("wordHistory");
    return () => {
      setCurrentLocationData("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { data: wordList } = useQuery<MemorizeWordListResponseDto[]>({
    queryKey: ["memorizeWordList"],
    queryFn: () => getMemorizeWordList(),
  });

  const [toStudyWords, setToStudyWords] = useState<Word[]>([]);

  useEffect(() => {
    if (wordList) {
      const toStudy = wordList
        .filter((word) => !word.complete)
        .map((word) => ({
          id: word.wordId.toString(),
          title: word.word,
          content: word.wordMeaning,
        }));
      setToStudyWords(toStudy);
    }
  }, [wordList]);

  if (isMobile) {
    return (
      <>
        <HeaderMobile title="Word Test" url="/mystudy" />
        <MobileLayout>
          <StartWordTestWidget posibleWords={toStudyWords.length} />
          <WordTestHistory />
        </MobileLayout>
      </>
    );
  }

  return (
    <Layout>
      <LeftContainer>
        <SmallContainer>
          <BackHeader>
            <BackArrow width={48} height={48} url="/mystudy" />
            <BackHeaderText>스터디로 돌아가기</BackHeaderText>
          </BackHeader>
          <StartWordTestWidget posibleWords={toStudyWords.length} />
        </SmallContainer>
      </LeftContainer>

      <RightContainer>
        <BigContainer>
          <WordTestHistory />
        </BigContainer>
      </RightContainer>
    </Layout>
  );
};

export default WordTestHistoryPage;

const Layout = styled.div`
  display: flex;
  width: 90%;
  min-height: 40rem;
  max-height: 50rem;
  margin: 0 auto;
  justify-content: space-between;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 36%;
`;

const RightContainer = styled.div`
  display: flex;
  width: 61%;
  align-items: center;
  justify-content: center;
`;

const SmallContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 46rem;
  background-color: ${(props) => props.theme.colors.cardBackground01};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: ${(props) => props.theme.shadows.small};
  transition: box-shadow 0.5s;
  width: 100%;
`;

const BigContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 46rem;
  background-color: ${(props) => props.theme.colors.cardBackground01};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: ${(props) => props.theme.shadows.small};
  transition: box-shadow 0.5s;
  width: 100%;
`;

const MobileLayout = styled.div`
  width: 85%;
  margin: 0 auto;
  padding-bottom: 6rem;
`;

const BackHeader = styled.div`
  display: flex;
  margin-right: auto;
  align-items: center;
  padding-top : 0.5rem;
  padding-left: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
`;


const BackHeaderText = styled.span`
margin-left: 1rem;
`