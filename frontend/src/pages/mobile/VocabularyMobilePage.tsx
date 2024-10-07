import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import VocaCollapsible from "@components/VocaCollapsible";
import {
  MemorizeWordListResponseDto,
  getMemorizeWordList,
} from "@services/wordMemorize";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@components/Spinner";
import HeaderMobile from "@components/common/HeaderMobile";

type Word = {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
};

const VocabularyPage: React.FC = () => {
  const setCurrentLocation = useSetRecoilState(locationState);

  const [currentView, setCurrentView] = useState<"toStudy" | "learned">(
    "toStudy"
  );
  const [toStudyWords, setToStudyWords] = useState<Word[]>([]);
  const [learnedWords, setLearnedWords] = useState<Word[]>([]);

  useEffect(() => {
    setCurrentLocation("Word Test Page");
  }, [setCurrentLocation]);

  const {
    data: wordList,
    isLoading,
    error,
  } = useQuery<MemorizeWordListResponseDto[]>({
    queryKey: ["memorizeWordList"],
    queryFn: () => getMemorizeWordList(),
  });

  useEffect(() => {
    if (wordList) {
      const toStudy = wordList
        .filter((word) => !word.complete)
        .map((word) => ({
          id: word.wordId.toString(),
          title: word.word,
          content: word.wordMeaning,
          isExpanded: false,
        }));
      const learned = wordList
        .filter((word) => word.complete)
        .map((word) => ({
          id: word.wordId.toString(),
          title: word.word,
          content: word.wordMeaning,
          isExpanded: false,
        }));
      setToStudyWords(toStudy);
      setLearnedWords(learned);
    }
  }, [wordList]);

  if (isLoading) return <Spinner />;
  if (error)
    return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  return (
    <>
      <HeaderMobile title="My Voca" />

      <NavMenu>
        <NavButtonWrapper active={currentView === "toStudy"}>
          <NavButton
            active={currentView === "toStudy"}
            onClick={() => setCurrentView("toStudy")}
          >
            <NavButtonText active={currentView === "toStudy"}>
              공부할 단어
            </NavButtonText>
            <WordCount>({toStudyWords.length})</WordCount>
          </NavButton>
        </NavButtonWrapper>

        <NavButtonWrapper active={currentView === "learned"}>
          <NavButton
            active={currentView === "learned"}
            onClick={() => setCurrentView("learned")}
          >
            <NavButtonText active={currentView === "learned"}>
              외운 단어
            </NavButtonText>
            <WordCount>({learnedWords.length})</WordCount>
          </NavButton>
        </NavButtonWrapper>
      </NavMenu>

      <MainLayout>
        <WordListLayout currentView={currentView}>
          <WordListContainer>
            {toStudyWords.length === 0 ? (
              <EmptyMessage>공부할 단어가 없습니다.</EmptyMessage>
            ) : (
              toStudyWords.map((word) => (
                <WordItem key={word.id}>
                  <VocaCollapsible
                    id={word.id}
                    title={word.title}
                    meaning={word.content}
                    isExpanded={word.isExpanded}
                    isState={false}
                  />
                </WordItem>
              ))
            )}
          </WordListContainer>

          <WordListContainer>
            {learnedWords.length === 0 ? (
              <EmptyMessage>외운 단어가 없습니다.</EmptyMessage>
            ) : (
              learnedWords.map((word) => (
                <WordItem key={word.id}>
                  <VocaCollapsible
                    id={word.id}
                    title={word.title}
                    meaning={word.content}
                    isExpanded={word.isExpanded}
                    isState={true}
                  />
                </WordItem>
              ))
            )}
          </WordListContainer>
        </WordListLayout>
      </MainLayout>
    </>
  );
};

export default VocabularyPage;

const MainLayout = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
`;

const WordListLayout = styled.div<{ currentView: string }>`
  display: flex;
  transform: ${(props) =>
    props.currentView === "toStudy" ? "translateX(100)" : "translateX(-100%)"};
  transition: transform 0.5s ease;
`;

const WordListContainer = styled.div`
  width: 100%;
  padding-bottom: 5rem;
  flex-shrink: 0;
`;

const WordItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  margin: auto;
  width: 90%;
`;

const WordCount = styled.span`
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

const EmptyMessage = styled.p`
  text-align: center;
  margin-top: 2rem;
`;

const NavMenu = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  width: 100%;
  border-bottom: 0.5px solid ${(props) => props.theme.colors.readonly};
`;

const NavButtonWrapper = styled.div<{ active: boolean }>`
  width: 100%;
  text-align: center;
  border-bottom: ${(props) =>
    props.active ? `3px solid ${props.theme.colors.primary}` : "none"};
`;

const NavButton = styled.button<{ active: boolean }>`
  background-color: transparent;
  color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.placeholder};
  font-size: 1.125rem;
  font-weight: ${(props) => (props.active ? "700" : "500")};
  cursor: pointer;
  border: none;
  width: 100%;
  padding: 1rem 0;
`;

const NavButtonText = styled.span<{ active: boolean }>`
  color: ${(props) =>
    props.active ? props.theme.colors.text : props.theme.colors.placeholder};
  transition: color 0.5s ease;
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;
