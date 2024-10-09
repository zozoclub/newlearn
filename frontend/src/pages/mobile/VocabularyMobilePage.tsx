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
import MobileLogoHeader from "@components/common/MobileLogoHeader";

type Word = {
  ids: string[];
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
      const toStudyMap = new Map<string, Word>(); // title을 키로 사용하여 단어 정보를 저장하는 Map 생성
      const learnedMap = new Map<string, Word>();

      wordList.forEach((word) => {
        if (!word.complete) {
          if (toStudyMap.has(word.word)) {
            // 이미 존재하는 단어라면 id를 추가
            toStudyMap.get(word.word)!.ids.push(word.wordId.toString());
          } else {
            // 새로운 단어라면 Map에 추가
            toStudyMap.set(word.word, {
              ids: [word.wordId.toString()],
              title: word.word,
              content: word.wordMeaning,
              isExpanded: false,
            });
          }
        } else {
          if (learnedMap.has(word.word)) {
            // 이미 존재하는 단어라면 id를 추가
            learnedMap.get(word.word)!.ids.push(word.wordId.toString());
          } else {
            // 새로운 단어라면 Map에 추가
            learnedMap.set(word.word, {
              ids: [word.wordId.toString()],
              title: word.word,
              content: word.wordMeaning,
              isExpanded: false,
            });
          }
        }
      });
  
      // Map을 배열로 변환
      const toStudy = Array.from(toStudyMap.values());
      const learned = Array.from(learnedMap.values());
  
      setToStudyWords(toStudy);
      setLearnedWords(learned);
    }
  }, [wordList]);

  if (isLoading) return <Spinner />;
  if (error)
    return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  return (
    <>
      <MobileLogoHeader />
      <NavMenu>
        <NavButtonWrapper $active={currentView === "toStudy"}>
          <NavButton
            $active={currentView === "toStudy"}
            onClick={() => setCurrentView("toStudy")}
          >
            <NavButtonText $active={currentView === "toStudy"}>
              공부할 단어
            </NavButtonText>
            <WordCount>({toStudyWords.length})</WordCount>
          </NavButton>
        </NavButtonWrapper>

        <NavButtonWrapper $active={currentView === "learned"}>
          <NavButton
            $active={currentView === "learned"}
            onClick={() => setCurrentView("learned")}
          >
            <NavButtonText $active={currentView === "learned"}>
              외운 단어
            </NavButtonText>
            <WordCount>({learnedWords.length})</WordCount>
          </NavButton>
        </NavButtonWrapper>
      </NavMenu>

      <MainLayout>
        <WordListLayout $currentView={currentView}>
          <WordListContainer>
            {toStudyWords.length === 0 ? (
              <EmptyMessage>공부할 단어가 없습니다.</EmptyMessage>
            ) : (
              toStudyWords.map((word) => (
                <WordItem key={word.ids.join(",")}>
                  <VocaCollapsible
                    ids={word.ids} // id 대신 ids로 변경
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
              <>
                <EmptyMessage>외운 단어가 없습니다.</EmptyMessage>
              </>
            ) : (
              learnedWords.map((word) => (
                <WordItem key={word.ids.join(",")}>
                  <VocaCollapsible
                    ids={word.ids} // id 대신 ids로 변경
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
  width: 100%;
  overflow: hidden;
`;

const WordListLayout = styled.div<{ $currentView: string }>`
  display: flex;
  transform: ${(props) =>
    props.$currentView === "toStudy" ? "translateX(100)" : "translateX(-100%)"};
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

const NavButtonWrapper = styled.div<{ $active: boolean }>`
  width: 100%;
  text-align: center;
  border-bottom: ${(props) =>
    props.$active ? `3px solid ${props.theme.colors.primary}` : "none"};
`;

const NavButton = styled.button<{ $active: boolean }>`
  background-color: transparent;
  color: ${(props) =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.placeholder};
  font-size: 1.125rem;
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  cursor: pointer;
  border: none;
  width: 100%;
  padding: 1rem 0;
`;

const NavButtonText = styled.span<{ $active: boolean }>`
  color: ${(props) =>
    props.$active ? props.theme.colors.text : props.theme.colors.placeholder};
  transition: color 0.5s ease;
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;
