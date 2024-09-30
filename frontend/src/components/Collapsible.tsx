import React, { useRef, useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";

type CollapsibleProps = {
  title: string;
  meaning: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  meaning,
  children,
  isExpanded,
  onToggle,
  onDelete,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const currentHeight = isExpanded ? contentRef.current?.scrollHeight : 0;

  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const openDeleteModal = () => setIsDeleteModal(true);
  const closeDeleteModal = () => setIsDeleteModal(false);

  const onDeleteHandler = () => {
    openDeleteModal();
  };

  const handleDeleteConfirm = () => {
    onDelete();
  };

  return (
    <>
      <ListItem>
        <Title onClick={onToggle}>
          <TitleContent>
            <TitleWord>{title}</TitleWord>
          </TitleContent>
          <TitleMeaning>{meaning}</TitleMeaning>
          <Arrow $isExpanded={isExpanded}>▼</Arrow>
          <DeleteButton onClick={onDeleteHandler}>&times;</DeleteButton>
        </Title>
        <ContentContainer
          ref={contentRef}
          style={{ height: `${currentHeight}px` }}
          $isExpanded={isExpanded}
        >
          <Content>{children}</Content>
        </ContentContainer>
      </ListItem>
      <Modal
        isOpen={isDeleteModal}
        onClose={closeDeleteModal}
        title="Vocabulary"
      >
        <p>삭제하시겠습니까?</p>
        <ModalButtonContainer>
          <ModalCancelButton onClick={closeDeleteModal}>취소</ModalCancelButton>
          <ModalConfirmButton onClick={handleDeleteConfirm}>
            확인
          </ModalConfirmButton>
        </ModalButtonContainer>
      </Modal>
    </>
  );
};

export default Collapsible;

const ListItem = styled.div`
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
`;

const Title = styled.div`
  background-color: ${(props) => props.theme.colors.shadow}7F;
  color: ${(props) => props.theme.colors.text};
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
`;

const TitleContent = styled.div`
  min-width: 30%;
`;

const TitleWord = styled.span`
  color: ${(props) => props.theme.colors.text};
`;

const TitleMeaning = styled.span`
  color: ${(props) => props.theme.colors.placeholder};
  font-size: 1rem;
`;

const Arrow = styled.div<{ $isExpanded: boolean }>`
  font-size: 0.75rem;
  margin-left: auto;
  margin-top: 0.15rem;
  margin-right: 1rem;
  transform: ${({ $isExpanded }) =>
    $isExpanded ? "rotate(180deg)" : "rotate(0deg)"};
  transition: transform 0.2s ease;
`;

const ContentContainer = styled.div<{ $isExpanded: boolean }>`
  overflow: hidden;
  transition: height 0.2s ease-in-out;
  height: ${({ $isExpanded }) => ($isExpanded ? "auto" : "0")};
`;

const Content = styled.div`
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.shadow}4F;
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.5;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
`;

const ModalCancelButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.placeholder};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.danger};
  }
`;
const ModalConfirmButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const DeleteButton = styled.div`
  color: ${(props) => props.theme.colors.danger};
`;
