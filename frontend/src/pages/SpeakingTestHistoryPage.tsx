import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  MemorizeWordListResponseDto,
  getMemorizeWordList,
} from "@services/wordMemorize";
import StartSpeakingTestWidget from "@components/testpage/StartSpeakingTestWidget";
import SpeakingTestHistory from "@components/testpage/SpeakingTestHistory";

type Word = {
  id: string;
  title: string;
  content: string;
};

const SpeakingTestHistoryPage: React.FC = () => {
  const setCurrentLocation = useSetRecoilState(locationState);

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
    setCurrentLocation("SpeakingTestHistoryPage");
  }, [setCurrentLocation]);

  return (
    <Layout>
      <LeftContainer>
        <SmallContainer>
          <StartSpeakingTestWidget posibleWords={toStudyWords.length + learnedWords.length} />
        </SmallContainer>
      </LeftContainer>

      <RightContainer>
        <BigContainer>
          <SpeakingTestHistory />
        </BigContainer>
      </RightContainer>
    </Layout>
  );
};

export default SpeakingTestHistoryPage;

const Layout = styled.div`
  display: flex;
  width: 90%;
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
  align-items: center;
  justify-content: center;
  height: 47rem;
  margin: 0.75rem 0;
  padding: 0.625rem;
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
  height: 48rem;
  margin: 0.75rem 0;
  background-color: ${(props) => props.theme.colors.cardBackground01};
  backdrop-filter: blur(0.25rem);
  border-radius: 0.75rem;
  box-shadow: ${(props) => props.theme.shadows.small};
  transition: box-shadow 0.5s;
  width: 100%;
`;
