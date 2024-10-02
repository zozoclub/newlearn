import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Modal from "./Modal";
import { getWordDetail, WordDetailResponseDto } from "@services/wordMemorize";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./Spinner";

type VocaCollapsibleProps = {
  title: string;
  meaning: string;
  isExpanded: boolean;
  onDelete: () => void;
};

const VocaCollapsible: React.FC<VocaCollapsibleProps> = ({
  title,
  meaning,
  isExpanded,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState<boolean>(isExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<WordDetailResponseDto>({
    queryKey: ["wordDetail", title],
    queryFn: () => getWordDetail(title),
    enabled: expanded, // 확장 시에만 데이터 가져오기
  });

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const openDeleteModal = () => setIsDeleteModal(true);
  const closeDeleteModal = () => setIsDeleteModal(false);

  const handleDeleteConfirm = () => {
    onDelete();
  };

  const handleNewsLinkClick = (newsId: number) => {
    navigate(`/news/detail/${newsId}`);
  };

  const currentHeight = expanded ? contentRef.current?.scrollHeight : 0;

  return (
    <>
      <ListItem>
        <Title onClick={toggleExpand}>
          <TitleContent>
            <TitleWord>{title}</TitleWord>
          </TitleContent>
          <TitleMeaning>{meaning}</TitleMeaning>
          <Arrow $isExpanded={expanded}>▼</Arrow>
          <DeleteButton onClick={openDeleteModal}>&times;</DeleteButton>
        </Title>
        <ContentContainer
          ref={contentRef}
          style={{ height: `${currentHeight}px` }}
          $isExpanded={expanded}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <Content>
              {data?.sentences.map((sentence) => (
                <SentenceContainer key={sentence.newsId}>
                  <SentenceHeader>
                    <DifficultyChip $difficulty={sentence.difficulty}>
                      {sentence.difficulty === 1
                        ? "초급"
                        : sentence.difficulty === 2
                        ? "중급"
                        : sentence.difficulty === 3
                        ? "고급"
                        : "알 수 없음"}
                    </DifficultyChip>
                    <NewsLinkButton
                      onClick={() => handleNewsLinkClick(sentence.newsId)}
                    >
                      원문 보기
                    </NewsLinkButton>
                  </SentenceHeader>
                  <SentenceText>{sentence.sentence}</SentenceText>
                  <SentenceMeaning>{sentence.sentenceMeaning}</SentenceMeaning>
                </SentenceContainer>
              ))}
            </Content>
          )}
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

export default VocaCollapsible;

const ListItem = styled.div`
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
`;

const Title = styled.div`
  background-color: ${(props) => props.theme.shadows.medium};
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
  transition: transform 0.3s ease;
`;

const ContentContainer = styled.div<{ $isExpanded: boolean }>`
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  height: ${({ $isExpanded }) => ($isExpanded ? "auto" : "0")};
`;

const Content = styled.div`
  padding: 1rem;
  background-color: ${(props) => props.theme.shadows.medium};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.5;
`;

const SentenceContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SentenceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const DifficultyChip = styled.div<{ $difficulty: number }>`
  background-color: ${({ $difficulty }) =>
    $difficulty === 1 ? "#4caf50" : $difficulty === 2 ? "#ff9800" : "#f44336"};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: bold;
`;

const NewsLinkButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;

const SentenceText = styled.p`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const SentenceMeaning = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text04};
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
