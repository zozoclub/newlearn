import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

import RecordingIcon from "@assets/icons/RecordingIcon";
import StartRecordingIcon from "@assets/icons/StartRecordingIcon";
import RestartRecordingIcon from "@assets/icons/RestartRecordingIcon";
import Modal from "@components/Modal";

import "@styles/AudioStyle.css";

type Props = {
  startUserRecording: () => void;
  stopUserRecording: () => void;
  restartRecording: () => void;
  audioUrl?: string;
  status: string;
  isStartRecordModal: boolean;
  startRecordingModal: () => void;
  closeRecordingModal: () => void;
};

const SpeakingTestRecord: React.FC<Props> = ({
  startUserRecording,
  stopUserRecording,
  audioUrl,
  status,
  isStartRecordModal,
  startRecordingModal,
  closeRecordingModal,
}) => {
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const audioPlayerRef = useRef<HTMLDivElement>(null); // Green Audio Player ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const greenAudioPlayerInstance = useRef<any>(null);

  // Green Audio Player 초기화
  useEffect(() => {
    if (audioUrl && audioPlayerRef.current) {
      // 이전 인스턴스가 있으면 정리
      if (greenAudioPlayerInstance.current) {
        greenAudioPlayerInstance.current.destroy();
      }

      // 새로운 Green Audio Player 초기화
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      greenAudioPlayerInstance.current = new (window as any).GreenAudioPlayer(
        audioPlayerRef.current
      );
    }

    return () => {
      if (greenAudioPlayerInstance.current) {
        greenAudioPlayerInstance.current = null;
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (status === "recording") {
      setIsRecording(true);
      setIsRecorded(false);
      timer = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timer) {
        clearInterval(timer);
      }
      setIsRecording(false);
    }

    return () => {
      if (timer) {
        clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
      }
    };
  }, [status]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleStopRecording = () => {
    stopUserRecording();
    setIsRecorded(true);
    setRecordingTime(0);
  };

  // 재녹음 시작 모달
  const [isReStartRecordModal, setReIsStartRecordModal] = useState(false);
  const reStartRecordingModal = () => setReIsStartRecordModal(true);
  const closeReRecordingModal = () => setReIsStartRecordModal(false);

  const handleRestartRecording = () => {
    closeReRecordingModal();
    setIsRecorded(false); // 재녹음
    startRecordingModal();
  };

  return (
    <>
      {/* 아무것도 녹음되지 않은 상태 */}
      {!isRecording && !isRecorded && (
        <>
          <StartRecordingIcon onClick={startRecordingModal} />
          <PromptText>마이크 버튼을 눌러 녹음을 시작하세요.</PromptText>
          {/* 녹음 모달 */}
          <Modal
            isOpen={isStartRecordModal}
            onClose={closeRecordingModal}
            title="Speaking Test"
          >
            <p>녹음 준비가 완료되었으면 확인 버튼을 눌러주세요</p>
            <ModalButtonContainer>
              <ModalCancelButton onClick={closeRecordingModal}>
                취소
              </ModalCancelButton>
              <ModalConfirmButton onClick={startUserRecording}>
                확인
              </ModalConfirmButton>
            </ModalButtonContainer>
          </Modal>
        </>
      )}

      {/* 녹음 중 상태 */}
      {isRecording && (
        <>
          <RecordingContainer>
            <Pulse />
            <RecordingIconStyled />
          </RecordingContainer>
          {/* 녹음 중일 때 시각적 효과 */}
          <RecordingStatus>녹음 중입니다...</RecordingStatus>
          <RecordingTime>{formatTime(recordingTime)}</RecordingTime>
          <StopButton onClick={handleStopRecording}>녹음 정지</StopButton>
        </>
      )}

      {/* 녹음이 완료된 상태 */}
      {!isRecording && isRecorded && (
        <>
          {audioUrl && (
            <StyledAudioPlayer
            ref={audioPlayerRef}
            className="green-audio-player"
            >
              <audio controls style={{ display: "none" }}>
                <source src={audioUrl} type="audio/mpeg" />
              </audio>
            </StyledAudioPlayer>
          )}
          <CompletionText>녹음이 완료되었습니다!</CompletionText>
          <RestartRecordingContainer>
            <RestartText onClick={reStartRecordingModal}>다시 녹음하기</RestartText>
            <RestartRecordingIconStyled onClick={reStartRecordingModal} />
            {/* 녹음 모달 */}
            <Modal
              isOpen={isReStartRecordModal}
              onClose={closeReRecordingModal}
              title="Speaking Test"
            >
              <p>이전 테스트 녹음 파일은 삭제됩니다.</p>
              <ModalButtonContainer>
                <ModalCancelButton onClick={closeReRecordingModal}>
                  취소
                </ModalCancelButton>
                <ModalConfirmButton onClick={handleRestartRecording}>
                  확인
                </ModalConfirmButton>
              </ModalButtonContainer>
            </Modal>
          </RestartRecordingContainer>
        </>
      )}
    </>
  );
};

export default SpeakingTestRecord;

// 파동 효과 애니메이션
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
`;

// 아이콘 크기 변화 애니메이션
const scaleAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;
const RecordingContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// 파동 애니메이션 효과
const Pulse = styled.div`
  position: absolute;
  width: 6.25rem;
  height: 6.25rem;
  background: rgba(2, 104, 237, 0.5);
  border-radius: 50%;
  animation: ${pulseAnimation} 1s infinite ease-out;
  z-index: -1;
`;

const RecordingIconStyled = styled(RecordingIcon)`
  width: 2rem;
  height: 2rem;
  animation: ${scaleAnimation} 1s infinite ease-in-out;
`;

const StopButton = styled.div`
  width: 5rem;
  height: 2rem;
  background-color: ${(props) => props.theme.colors.danger};
  color: white;
  text-align: center;
  line-height: 2rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 1rem;

  @media (max-width: 768px) {
    width: 4rem;
    height: 1.75rem;
    line-height: 1.75rem;
    font-size: 0.875rem;
  }
`;

const RecordingTime = styled.div`
  margin-top: 1rem;
  font-size: 1.25rem;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const RecordingStatus = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CompletionText = styled.p`
  color: ${(props) => props.theme.colors.text};
  font-size: 1.25rem;
  font-weight: 400;
  margin-top: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-top: 1.5rem;
  }
`;

const RestartRecordingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const RestartRecordingIconStyled = styled(RestartRecordingIcon)`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  margin-right: 0.5rem;

  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
`;

const RestartText = styled.p`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const PromptText = styled.p`
  color: ${(props) => props.theme.colors.text};
  font-size: 1.125rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
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

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
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

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

const StyledAudioPlayer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground01};
  box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
  margin: 0 1rem;

  @media (max-width: 768px) {
    margin: 0.5rem;
  }
`;

