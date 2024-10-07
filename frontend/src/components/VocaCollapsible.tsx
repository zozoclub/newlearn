import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Modal from "./Modal";
import {
  deleteMemorizeWord,
  getWordDetail,
  postMemorizeWord,
  WordDetailResponseDto,
} from "@services/wordMemorize";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "./Spinner";
import SpeakerIcon from "@assets/icons/SpeakerIcon";
import { useMediaQuery } from "react-responsive";

type VocaCollapsibleProps = {
  id: string;
  title: string;
  meaning: string;
  isExpanded: boolean;
  isState?: boolean;
};

const VocaCollapsible: React.FC<VocaCollapsibleProps> = ({
  id,
  title,
  meaning,
  isExpanded,
  isState,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [expanded, setExpanded] = useState<boolean>(isExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteMutation } = useMutation<void, Error, number>({
    mutationFn: (wordId: number) => deleteMemorizeWord(wordId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["memorizeWordList"] }),
  });

  const { data, isLoading } = useQuery<WordDetailResponseDto>({
    queryKey: ["wordDetail", title],
    queryFn: () => getWordDetail(title),
  });

  const toggleExpand = () => {
    console.log(id);

    setExpanded((prev) => !prev);
  };

  const { mutate: toggleMemorizeMutation } = useMutation<void, Error, number>({
    mutationFn: (wordId: number) => postMemorizeWord(wordId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["memorizeWordList"] }),
  });

  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const openDeleteModal = () => setIsDeleteModal(true);
  const closeDeleteModal = () => setIsDeleteModal(false);

  const handleDeleteConfirm = () => {
    console.log(id);
    deleteMutation(Number(id));
    closeDeleteModal();
  };

  const handleNewsLinkClick = (newsId: number) => {
    navigate(`/news/detail/${newsId}`);
  };

  const processMeaning = (meaning: string) => {
    const numberedMeaning = meaning
      .split("//")
      .map((word, index) => `${index + 1}. ${word}`)
      .join(" ");

    return numberedMeaning.length > 40
      ? `${numberedMeaning.slice(0, 40)}...`
      : numberedMeaning;
  };

  const fullProcessMeaning = (meaning: string) => {
    return meaning.split("//").map((line, index) => (
      <React.Fragment key={index}>
        {index + 1}. {line}
        <br />
      </React.Fragment>
    ));
  };

  const highlightWordInSentence = (sentence: string, word: string) => {
    const parts = sentence.split(new RegExp(`(${word})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === word.toLowerCase() ? (
        <HighlightedWord key={index}>{part}</HighlightedWord>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const handlePlayPronounceAudio = (audioUrl: string) => {
    const newAudioPlayer = new Audio(audioUrl);

    newAudioPlayer
      .play()
      .then(() => {
        console.log("Audio playback started.");
      })
      .catch((error) => {
        console.error("Error during audio playback:", error);
      });
  };
  const handleToggleWordState = (wordId: string) => {
    toggleMemorizeMutation(Number(wordId));
  };

  const currentHeight = expanded ? contentRef.current?.scrollHeight : 0;

  return (
    <>
      <ListItem>
        <Title onClick={toggleExpand}>
          <TitleContent>
            <TitleWord>{title.toLowerCase()}</TitleWord>
          </TitleContent>
          <TitleProcessMeaning $isExpanded={!expanded}>
            {processMeaning(meaning)}
          </TitleProcessMeaning>
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
              <AudioLayout>
                <AudioContainer>
                  <PronounceText>
                    US :{" "}
                    {data?.sentences[0].pronounceUs
                      ? data?.sentences[0].pronounceUs
                      : "None"}
                  </PronounceText>
                  <SpeakerIcon
                    onClick={() =>
                      handlePlayPronounceAudio(data!.sentences[0].audioUs)
                    }
                    width="20px"
                    height="20px"
                  />
                </AudioContainer>
                <AudioContainer>
                  <PronounceText>
                    UK :{" "}
                    {data?.sentences[0].pronounceUk
                      ? data?.sentences[0].pronounceUk
                      : "None"}
                  </PronounceText>
                  <SpeakerIcon
                    onClick={() =>
                      handlePlayPronounceAudio(data!.sentences[0].audioUk)
                    }
                    width="20px"
                    height="20px"
                  />
                </AudioContainer>
              </AudioLayout>
              <TitleMeaning>{fullProcessMeaning(meaning)}</TitleMeaning>
              {data?.sentences.map((sentence) => (
                <SentenceContainer key={sentence.newsId}>
                  <SentenceText>
                    {highlightWordInSentence(sentence.sentence, title)}
                  </SentenceText>
                  <SentenceMeaning>{sentence.sentenceMeaning}</SentenceMeaning>
                  <SentenceFooter>
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
                    {isMobile && (
                      <MobileActionButtonContainer>
                        <MobileActionButton
                          onClick={() => handleToggleWordState(id)}
                        >
                          {isState ? "공부할 단어로 이동" : "외운 단어로 이동"}
                        </MobileActionButton>
                      </MobileActionButtonContainer>
                    )}
                  </SentenceFooter>
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
  letter-spacing: 0.1px;

  width: 100%;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.125rem;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  background-color: ${(props) => props.theme.colors.newsItemBackground};
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;

  @media (max-width: 1280px) {
    font-size: 1.125rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const TitleContent = styled.div`
  min-width: 30%;
  @media (max-width: 768px) {
    min-width: 24%;
  }
`;

const TitleWord = styled.span`
  color: ${(props) => props.theme.colors.text};

  @media (max-width: 1280px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const TitleProcessMeaning = styled.span<{ $isExpanded: boolean }>`
  color: ${(props) => props.theme.colors.text04};
  font-weight: 400;
  font-size: 0.875rem;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  overflow: hidden;
  transition: opacity 0.3s ease, max-height 0.3s ease;

  @media (max-width: 1280px) {
    font-size: 0.75rem;
  }
  @media (max-width: 500px) {
    display: none;
  }
`;

const TitleMeaning = styled.span`
  color: ${(props) => props.theme.colors.text04};
  font-size: 0.875rem;

  @media (max-width: 1280px) {
    font-size: 0.75rem;
  }
`;

const Arrow = styled.div<{ $isExpanded: boolean }>`
  font-size: 0.75rem;
  margin-left: auto;
  margin-top: 0.15rem;
  margin-right: 1rem;
  transform: ${({ $isExpanded }) =>
    $isExpanded ? "rotate(180deg)" : "rotate(0deg)"};
  transition: transform 0.3s ease;

  @media (max-width: 1280px) {
    font-size: 0.625rem;
  }

  @media (max-width: 768px) {
    font-size: 0.5rem;
  }
`;

const ContentContainer = styled.div<{ $isExpanded: boolean }>`
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  height: ${({ $isExpanded }) => ($isExpanded ? "auto" : "0")};
`;

const Content = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: ${(props) => props.theme.shadows.medium};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.5;

  @media (max-width: 1280px) {
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const SentenceContainer = styled.div`
  margin-bottom: 1rem;
`;

const SentenceFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const DifficultyChip = styled.div<{ $difficulty: number }>`
  background-color: ${({ $difficulty }) =>
    $difficulty === 1 ? "#4caf50" : $difficulty === 2 ? "#ff9800" : "#f44336"};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: bold;

  @media (max-width: 1280px) {
    font-size: 0.75rem;
  }
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

  @media (max-width: 1280px) {
    font-size: 0.75rem;
  }
  @media (max-width: 768px) {
    background-color: transparent;
    color: ${(props) => props.theme.colors.text04};
  }
`;

const SentenceText = styled.p`
  font-size: 1.125rem;
  font-weight: 500;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.001rem;

  @media (max-width: 1280px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const SentenceMeaning = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text04};

  @media (max-width: 1280px) {
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
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

  @media (max-width: 1280px) {
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
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

  @media (max-width: 1280px) {
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const DeleteButton = styled.div`
  color: ${(props) => props.theme.colors.danger};
`;

const HighlightedWord = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;

  @media (max-width: 1280px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const AudioLayout = styled.div`
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 0.375rem;
  }
`;

const AudioContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  letter-spacing: 0.01rem;
  font-size: 0.875rem;

  @media (max-width: 1280px) {
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const PronounceText = styled.p`
  margin-right: 1rem;

  @media (max-width: 1280px) {
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const MobileActionButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  width: 6.5rem;
  height: 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const MobileActionButtonContainer = styled.div`
  margin-left: auto;
`;
