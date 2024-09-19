import React, { useState } from "react";
import styled from "styled-components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from "@hello-pangea/dnd";

import Collapsible from "@components/Collapsible";

type Word = {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
};

const VocabularyPage: React.FC = () => {
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
      const list =
        source.droppableId === "toStudy" ? toStudyWords : learnedWords;
      const setList =
        source.droppableId === "toStudy" ? setToStudyWords : setLearnedWords;
      const reorderedItems = reorder(list, source.index, destination.index);
      setList(reorderedItems);
    } else {
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
  background-color: ${(props) =>
    props.theme.colors.cardBackground || "#f9f9f9"};
  box-shadow: 0.5rem 0.5rem 0.25rem rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  min-height: 300px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Item = styled.div<{ $isDragging: boolean }>`
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: ${(props) => (props.$isDragging ? "#f0f0f0" : "#fff")};
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  cursor: grab;
`;
