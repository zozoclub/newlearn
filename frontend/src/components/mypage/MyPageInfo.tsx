import { useState, useEffect } from "react";
import styled from "styled-components";
import EditIcon from "@assets/icons/EditIcon";
import Modal from "@components/Modal";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import userInfoState from "@store/userInfoState";
import { changeDifficulty, changeInterests } from "@services/mypageService";

const getDifficultyText = (difficulty: number): string => {
  switch (difficulty) {
    case 1:
      return "초급";
    case 2:
      return "중급";
    case 3:
      return "고급";
    default:
      return "난이도 안뜸";
  }
};

const MyPageInfo: React.FC = () => {
  const queryClient = useQueryClient();
  const userInfo = useRecoilValue(userInfoState);
  const setUserInfo = useSetRecoilState(userInfoState);

  const [difficulty, setDifficulty] = useState<number>(1);
  const [tempDifficulty, setTempDifficulty] = useState<number>(1);

  const categoryList = ["경제", "정치", "사회", "생활/문화", "IT/과학", "세계"];
  const [interests, setInterests] = useState<string[]>([]);
  const [tempInterests, setTempInterests] = useState<string[]>([]);

  useEffect(() => {
    if (userInfo.difficulty !== undefined) {
      setDifficulty(userInfo.difficulty);
      setTempDifficulty(userInfo.difficulty);
    }
    if (userInfo.categories) {
      setInterests(userInfo.categories);
      setTempInterests(userInfo.categories);
    }
  }, [userInfo]);

  // 영어 난이도 모달 설정
  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false);
  const openDifficultyModal = () => {
    setTempDifficulty(difficulty);
    setIsDifficultyModalOpen(true);
  };
  const closeDifficultyModal = () => {
    setIsDifficultyModalOpen(false);
  };

  const difficultyMutation = useMutation({
    mutationFn: changeDifficulty,
    onSuccess: () => {
      setDifficulty(tempDifficulty);
      setUserInfo((userInfo) => ({
        ...userInfo,
        difficulty: tempDifficulty,
      }));
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      closeDifficultyModal();
    },
    onError: (error) => {
      console.error("난이도 변경 실패:", error);
    },
  });

  // 모달 내에서 버튼 클릭했을 때 바뀌게 하는 로직
  const handleDifficultyChange = (newDifficulty: number) => {
    setTempDifficulty(newDifficulty);
  };

  // 난이도 수정을 저장하는 로직
  const handleDifficultyEdit = () => {
    difficultyMutation.mutate(tempDifficulty);
  };

  //
  // 관심 카테고리 모달 설정
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const openInterestsModal = () => {
    setTempInterests([...interests]);
    setIsInterestsModalOpen(true);
  };
  const closeInterestsModal = () => {
    setIsInterestsModalOpen(false);
  };

  const interestsMutation = useMutation({
    mutationFn: changeInterests,
    onSuccess: () => {
      setInterests(tempInterests);
      setUserInfo((userInfo) => ({
        ...userInfo,
        categories: tempInterests,
      }));
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      closeInterestsModal();
    },
    onError: (error) => {
      console.error("관심 카테고리 변경 실패:", error);
    },
  });

  const handleInterestsEdit = () => {
    interestsMutation.mutate(tempInterests);
  };

  const handleInterestsChange = (interest: string) => {
    setTempInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      } else if (prev.length < 3) {
        return [...prev, interest].sort();
      }
      return prev;
    });
  };

  return (
    <>
      <AllContainer>
        <Container>
          <TitleContainer>영어 난이도</TitleContainer>
          <ContentContainer>{getDifficultyText(difficulty)}</ContentContainer>
          <IconContainer>
            <EditIcon onClick={openDifficultyModal} />
          </IconContainer>
        </Container>
        <Container>
          <TitleContainer>카테고리</TitleContainer>
          <ContentContainer>
            {interests.map((interest, index) => (
              <span key={interest}>
                {interest}
                {index < interests.length - 1 ? ", " : ""}
              </span>
            ))}
          </ContentContainer>
          <IconContainer>
            <EditIcon onClick={openInterestsModal} />
          </IconContainer>
        </Container>
      </AllContainer>
      {/* 영어 난이도 모달 */}
      <Modal
        isOpen={isDifficultyModalOpen}
        onClose={closeDifficultyModal}
        title="영어 난이도 설정"
      >
        <ModalDescription>
          <div>설정한 난이도로 뉴스를 읽을 수 있어요.</div>
        </ModalDescription>
        <ModalItemContainer>
          {[1, 2, 3].map((level) => (
            <ModalButtonItem
              key={level}
              isSelected={tempDifficulty === level}
              onClick={() => handleDifficultyChange(level)}
            >
              {getDifficultyText(level)}
            </ModalButtonItem>
          ))}
        </ModalItemContainer>
        <ButtonContainer>
          <SaveButton onClick={handleDifficultyEdit}>저장</SaveButton>
        </ButtonContainer>
      </Modal>

      {/* 관심 카테고리 모달 */}
      <Modal
        isOpen={isInterestsModalOpen}
        onClose={closeInterestsModal}
        title="관심 카테고리 설정"
      >
        <ModalDescription>
          <div>관심 카테고리의 뉴스를 추천받을 수 있어요.</div>
          <StrongText>(최대 3개)</StrongText>
        </ModalDescription>
        <ModalItemContainer>
          {categoryList.map((interest) => (
            <ModalButtonItem
              key={interest}
              isSelected={tempInterests.includes(interest)}
              onClick={() => handleInterestsChange(interest)}
            >
              {interest}
            </ModalButtonItem>
          ))}
        </ModalItemContainer>
        <ButtonContainer>
          <SaveButton
            onClick={handleInterestsEdit}
            disabled={tempInterests.length === 0}
          >
            저장
          </SaveButton>
        </ButtonContainer>
      </Modal>
    </>
  );
};

export default MyPageInfo;

const AllContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  padding: 1rem;
  @media (max-width: 767px) {
    padding: 0.5rem;
  }
`;

const TitleContainer = styled.div`
  flex: 2;
  font-size: 1.25rem;
  font-weight: bold;
  @media (max-width: 767px) {
    font-size: 1rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 3;
  gap: 0.875rem;
  font-size: 1.25rem;
  @media (max-width: 767px) {
    font-size: 1rem;
  }
`;

const IconContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

// 모달 버튼
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const CustomButton = styled.button`
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.15s ease, color 0.15s ease,
    transform 0.15s ease;
  cursor: pointer;
`;

const ModalDescription = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 1.75rem;
  color: gray;
  font-size: 1rem;
`;

const StrongText = styled.div`
  font-weight: bold;
`;

const ModalItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0 1rem;
  gap: 1rem 2rem;
  margin-bottom: 2rem;
`;

const ModalButtonItem = styled(CustomButton)<{ isSelected: boolean }>`
  color: ${(props) => (props.isSelected ? "white" : props.theme.colors.text02)};
  background-color: ${(props) =>
    props.isSelected
      ? props.theme.colors.primary
      : props.theme.colors.readonly};
  &:hover {
    background-color: ${(props) =>
      props.isSelected
        ? props.theme.colors.primaryPress
        : props.theme.colors.placeholder};
  }
  font-size: 1.25rem;
`;

const SaveButton = styled(CustomButton)`
  border-radius: 1rem;
  color: white;
  background-color: ${(props) =>
    props.disabled ? props.theme.colors.text04 : props.theme.colors.primary};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.text04
        : props.theme.colors.primaryPress};
  }
`;
