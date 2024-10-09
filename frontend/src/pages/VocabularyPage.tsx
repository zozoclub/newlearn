import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from "@hello-pangea/dnd";
import locationState from "@store/locationState";
import VocaCollapsible from "@components/VocaCollapsible";

import { useSetRecoilState } from "recoil";
import {
  MemorizeWordListResponseDto,
  getMemorizeWordList,
  postMemorizeWord,
} from "@services/wordMemorize";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "@components/Spinner";
import { useMediaQuery } from "react-responsive";
import VocabularyMobilePage from "./mobile/VocabularyMobilePage";

type Word = {
  ids: string[];
  title: string;
  content: string;
  isExpanded: boolean;
};

const VocabularyPage: React.FC = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const setCurrentLocation = useSetRecoilState(locationState);
  const queryClient = useQueryClient();

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

  const [toStudyWords, setToStudyWords] = useState<Word[]>([]);
  const [learnedWords, setLearnedWords] = useState<Word[]>([]);

  const { mutate: toggleMemorizeMutation } = useMutation<void, Error, number[]>({
    mutationFn: (wordIds: number[]) => postMemorizeWord(wordIds),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["memorizeWordList"] }),
  });

  useEffect(() => {
    console.log(wordList);
  
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

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
      // 리스트 내에서 위치만 변경 (실질적인 인덱스 변경은 없음)
      const list =
        source.droppableId === "toStudy" ? toStudyWords : learnedWords;
      const setList =
        source.droppableId === "toStudy" ? setToStudyWords : setLearnedWords;
      const reorderedItems = reorder(list, source.index, destination.index);
      setList(reorderedItems);
    } else {
      // 외움 상태 변경 API 호출
      const wordIds =
      source.droppableId === "toStudy"
        ? toStudyWords[source.index].ids
        : learnedWords[source.index].ids;

        toggleMemorizeMutation(wordIds.map(Number));

      if (source.droppableId === "toStudy") {
        moveItemBetweenLists(toStudyWords, learnedWords, source, destination);
      } else {
        moveItemBetweenLists(learnedWords, toStudyWords, source, destination);
      }
    }
  };

  const reorder = (
    list: Word[],
    startIndex: number,
    endIndex: number
  ): Word[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const moveItemBetweenLists = (
    sourceList: Word[],
    destinationList: Word[],
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const sourceClone = Array.from(sourceList);
    const destClone = Array.from(destinationList);
    const [movedItem] = sourceClone.splice(source.index, 1);
    destClone.splice(destination.index, 0, movedItem);
    if (source.droppableId === "toStudy") {
      setToStudyWords(sourceClone);
      setLearnedWords(destClone);
    } else {
      setLearnedWords(sourceClone);
      setToStudyWords(destClone);
    }
  };

  if (isMobile) {
    return <VocabularyMobilePage />;
  }

  if (isLoading) return <Spinner />;

  if (error)
    return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <MainLayout>
        {/* 외워야 할 단어 리스트 */}
        <Droppable droppableId="toStudy">
          {(provided) => (
            <MainContainer ref={provided.innerRef} {...provided.droppableProps}>
              <TitleContainer>
                <Title>공부해야 될 단어 리스트</Title>
                <WordCount>({toStudyWords.length})</WordCount>
              </TitleContainer>
              {toStudyWords.length === 0 ? (
                <EmptyMessage>공부할 단어가 없습니다.</EmptyMessage>
              ) : (
                toStudyWords.map((data, index) => (
                  <Draggable key={data.ids.join('-')} draggableId={data.ids.join('-')} index={index}>
                    {(provided, snapshot) => (
                      <Item
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        $isDragging={snapshot.isDragging}
                      >
                        <VocaCollapsible
                          ids={data.ids}
                          title={data.title}
                          meaning={data.content}
                          isExpanded={data.isExpanded}
                        />
                      </Item>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </MainContainer>
          )}
        </Droppable>

        {/* 외운 단어 리스트 */}
        <Droppable droppableId="learned">
          {(provided) => (
            <MainContainer ref={provided.innerRef} {...provided.droppableProps}>
              <TitleContainer>
                <Title>외운 단어 리스트</Title>
                <WordCount>({learnedWords.length})</WordCount>
              </TitleContainer>
              {learnedWords.length === 0 ? (
                <EmptyMessage>외운 단어가 없습니다.</EmptyMessage>
              ) : (
                learnedWords.map((data, index) => (
                  <Draggable key={data.ids.join('-')} draggableId={data.ids.join('-')} index={index}>
                    {(provided, snapshot) => (
                      <Item
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        $isDragging={snapshot.isDragging}
                      >
                        <VocaCollapsible
                          ids={data.ids}
                          title={data.title}
                          meaning={data.content}
                          isExpanded={data.isExpanded}
                        />
                      </Item>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </MainContainer>
          )}
        </Droppable>
      </MainLayout>
    </DragDropContext>
  );
};

export default VocabularyPage;

const MainLayout = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin: 0 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 46%;
  padding: 1rem;
  min-height: 40rem;
  max-height: 50rem;
  background-color: ${(props) => `${props.theme.colors.cardBackground01}`};
  border-radius: 0.75rem;

  overflow-y: auto;
  box-shadow: ${(props) => props.theme.shadows.small};
  transition: box-shadow 0.5s;

  @media (max-width: 1280px) {
    padding: 0.75rem;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0 2rem;
`;

const Title = styled.h2`
  text-align: center;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 700;

  @media (max-width: 1280px) {
    font-size: 1.75rem;
  }
`;

const WordCount = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text04};
  margin-left: 0.5rem;

  @media (max-width: 1280px) {
    font-size: 0.875rem;
  }
`;

const Item = styled.div<{ $isDragging: boolean }>`
  cursor: grab;
`;

const EmptyMessage = styled.p`
  margin-top: 16rem;
  text-align: center;
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.text04};

  @media (max-width: 1280px) {
    font-size: 1rem;
  }
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;

  @media (max-width: 1280px) {
    font-size: 1rem;
  }
`;
