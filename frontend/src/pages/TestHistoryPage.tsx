import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive"; // 모바일 여부 감지

import StartWordTestWidget from "@components/testpage/StartWordTestWidget";
import StartSpeakingTestWidget from "@components/testpage/StartSpeakingTestWidget";
import SpeakingTestHistory from "@components/testpage/SpeakingTestHistory";
import WordTestHistory from "@components/testpage/WordTestHistory";

// 모바일
import TestIntroMobilePage from "./mobile/TestIntroMobilePage";
import {
  MemorizeWordListResponseDto,
  getMemorizeWordList,
} from "@services/wordMemorize";
import { useQuery } from "@tanstack/react-query";

type Word = {
  id: string;
  title: string;
  content: string;
};

const TestHistoryPage: React.FC = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const setCurrentLocation = useSetRecoilState(locationState);
  const [activeTab, setActiveTab] = useState("word");

  const { data: wordList } = useQuery<MemorizeWordListResponseDto[]>({
    queryKey: ["memorizeWordList"],
    queryFn: () => getMemorizeWordList(),
  });

  const [toStudyWords, setToStudyWords] = useState<Word[]>([]);
  const [learnedWords, setLearnedWords] = useState<Word[]>([]);

  useEffect(() => {
    if (wordList) {
      const toStudy = wordList
        .filter((word) => !word.complete)
        .map((word) => ({
          id: word.wordId.toString(),
          title: word.word,
          content: word.wordMeaning,
        }));
      const learned = wordList
        .filter((word) => word.complete)
        .map((word) => ({
          id: word.wordId.toString(),
          title: word.word,
          content: word.wordMeaning,
        }));
      setToStudyWords(toStudy);
      setLearnedWords(learned);
    }
  }, [wordList]);

  useEffect(() => {
    setCurrentLocation("TestHistoryPage");
  }, [setCurrentLocation]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  if (isMobile) {
    return <TestIntroMobilePage />;
  }
  return (
    <Layout>
      <LeftContainer>
        <SmallContainer>
          <StartWordTestWidget posibleWords={toStudyWords.length} />
        </SmallContainer>
        <SmallContainer>
          <StartSpeakingTestWidget posibleWords={toStudyWords.length + learnedWords.length}/>
        </SmallContainer>
      </LeftContainer>

      <RightContainer>
        <BigContainer>
          {/* 탭 버튼 상단 */}
          <TabButtons>
            <WordTabButton
              $isActive={activeTab === "word"}
              onClick={() => handleTabChange("word")}
            >
              단어 테스트 기록
            </WordTabButton>
            <SpeakTabButton
              $isActive={activeTab === "speak"}
              onClick={() => handleTabChange("speak")}
            >
              스피킹 테스트 기록
            </SpeakTabButton>
          </TabButtons>

          {/* 조건부 렌더링 */}
          <Nav>
            {activeTab === "word" && <WordTestHistory />}
            {activeTab === "speak" && <SpeakingTestHistory />}
          </Nav>
        </BigContainer>
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
  min-height: 22rem;
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
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 48rem;
  margin: 0.75rem 0;
  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: box-shadow 0.5s;
  width: 100%;
`;

const TabButtons = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

interface TabButtonProps {
  $isActive: boolean;
}

const WordTabButton = styled.button<TabButtonProps>`
  padding: 0.75rem 1.5rem;
  width: 100%;
  background-color: ${(props) =>
    props.$isActive ? props.theme.colors.primary : "transparent"};
  color: ${(props) => (props.$isActive ? "white" : props.theme.colors.primary)};
  border: none;
  border-top-left-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-weight: 600;
  font-size: 1rem;
`;

const SpeakTabButton = styled.button<TabButtonProps>`
  padding: 0.75rem 1.5rem;
  width: 100%;
  background-color: ${(props) =>
    props.$isActive ? props.theme.colors.primary : "transparent"};
  color: ${(props) => (props.$isActive ? "white" : props.theme.colors.primary)};
  border: none;
  border-top-right-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-weight: 600;
  font-size: 1rem;
`;

const Nav = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
`;
