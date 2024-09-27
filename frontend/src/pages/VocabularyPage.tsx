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

import Collapsible from "@components/Collapsible";
import { useSetRecoilState } from "recoil";
import WordHunt from "@components/WordHunt";

type Word = {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
};

const VocabularyPage: React.FC = () => {
  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Word Test Page");
  }, [setCurrentLocation]);

  const [toStudyWords, setToStudyWords] = useState<Word[]>([
    {
      id: "1",
      title: "Overview",
      content: "This is the overview content.",
      isExpanded: false,
    },
    {
      id: "2",
      title: "Features",
      content: "These are the features.",
      isExpanded: false,
    },
    {
      id: "3",
      title: "Review",
      content: "Here is a detailed review.",
      isExpanded: false,
    },
  ]);

  const [learnedWords, setLearnedWords] = useState<Word[]>([
    {
      id: "4",
      title: "Firebase",
      content: "Firebase is a platform.",
      isExpanded: false,
    },
  ]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      console.log("목적지가 같은 리스트인 경우");
      return;
      const list =
        source.droppableId === "toStudy" ? toStudyWords : learnedWords;
      const setList =
        source.droppableId === "toStudy" ? setToStudyWords : setLearnedWords;
      const reorderedItems = reorder(list, source.index, destination!.index);
      setList(reorderedItems);
    } else {
      if (source.droppableId === "toStudy") {
        console.log(
          "출발지가 공부해야 할 단어 리스트이므로 공부 -> 외운 api 호출"
        );
        moveItemBetweenLists(toStudyWords, learnedWords, source, destination);
      } else {
        console.log(
          "출발지가 내가 외운 단어 리스트이므로 외운 -> 공부 api 호출"
        );
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

  // Collapsible 토글 함수
  const toggleExpand = (id: string, isToStudyList: boolean) => {
    const setList = isToStudyList ? setToStudyWords : setLearnedWords;
    const list = isToStudyList ? toStudyWords : learnedWords;
    const updatedList = list.map((word) =>
      word.id === id ? { ...word, isExpanded: !word.isExpanded } : word
    );
    setList(updatedList);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <MainLayout>
        {/* 외워야 할 단어 리스트 */}
        <Droppable droppableId="toStudy">
          {(provided) => (
            <MainContainer ref={provided.innerRef} {...provided.droppableProps}>
              <Title>내가 공부해야 될 단어 리스트</Title>
              {toStudyWords.map((data, index) => (
                <Draggable key={data.id} draggableId={data.id} index={index}>
                  {(provided, snapshot) => (
                    <Item
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      $isDragging={snapshot.isDragging}
                    >
                      <Collapsible
                        title={data.title}
                        isExpanded={data.isExpanded}
                        onToggle={() => toggleExpand(data.id, true)}
                      >
                        <p>{data.content}</p>
                      </Collapsible>
                    </Item>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </MainContainer>
          )}
        </Droppable>

        {/* 외운 단어 리스트 */}
        <Droppable droppableId="learned">
          {(provided) => (
            <MainContainer ref={provided.innerRef} {...provided.droppableProps}>
              <Title>내가 외운 단어 리스트</Title>
              {learnedWords.map((data, index) => (
                <Draggable key={data.id} draggableId={data.id} index={index}>
                  {(provided, snapshot) => (
                    <Item
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      $isDragging={snapshot.isDragging}
                    >
                      <Collapsible
                        title={data.title}
                        isExpanded={data.isExpanded}
                        onToggle={() => toggleExpand(data.id, false)}
                      >
                        <p>{data.content}</p>
                      </Collapsible>
                    </Item>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </MainContainer>
          )}
        </Droppable>
        <WordHunt />
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
  width: 45%;
  padding: 1rem;
  background-color: ${(props) => `${props.theme.colors.cardBackground}BF`};
  border-radius: 0.75rem;
  min-height: 600px;
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};
  transition: box-shadow 0.5s;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Item = styled.div<{ $isDragging: boolean }>`
  cursor: grab;
`;
