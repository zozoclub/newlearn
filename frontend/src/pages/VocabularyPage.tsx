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

type Word = {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
};

const VocabularyPage: React.FC = () => {
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

  const { mutate: toggleMemorizeMutation } = useMutation<void, Error, number>({
    mutationFn: (wordId: number) => postMemorizeWord(wordId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["memorizeWordList"] }),
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
      const wordId =
        source.droppableId === "toStudy"
          ? toStudyWords[source.index].id
          : learnedWords[source.index].id;
      toggleMemorizeMutation(Number(wordId));

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
              <Title>
                공부해야 될 단어 리스트{" "}
                <WordCount>({toStudyWords.length})</WordCount>
              </Title>
              {toStudyWords.length === 0 ? (
                <EmptyMessage>공부할 단어가 없습니다.</EmptyMessage>
              ) : (
                toStudyWords.map((data, index) => (
                  <Draggable key={data.id} draggableId={data.id} index={index}>
                    {(provided, snapshot) => (
                      <Item
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        $isDragging={snapshot.isDragging}
                      >
                        <VocaCollapsible
                          id={data.id}
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
              <Title>
                외운 단어 리스트 <WordCount>({learnedWords.length})</WordCount>
              </Title>
              {learnedWords.length === 0 ? (
                <EmptyMessage>외운 단어가 없습니다.</EmptyMessage>
              ) : (
                learnedWords.map((data, index) => (
                  <Draggable key={data.id} draggableId={data.id} index={index}>
                    {(provided, snapshot) => (
                      <Item
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        $isDragging={snapshot.isDragging}
                      >
                        <VocaCollapsible
                          id={data.id}
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
`;

const MainContainer = styled.div`
  width: 47%;
  padding: 1rem;
  background-color: ${(props) => `${props.theme.colors.cardBackground}BF`};
  border-radius: 0.75rem;
  min-height: 800px;
  max-height: 800px;
  overflow-y: auto;
  box-shadow: ${(props) => props.theme.shadows.medium};
  transition: box-shadow 0.5s;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
`;

const WordCount = styled.span`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text04};
  margin-left: 0.5rem;
`;

const Item = styled.div<{ $isDragging: boolean }>`
  cursor: grab;
`;

const EmptyMessage = styled.p`
  margin-top: 16rem;
  text-align: center;
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.text04};
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;
