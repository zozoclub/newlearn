import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

import RecordingIcon from "@assets/icons/RecordingIcon";
import StartRecordingIcon from "@assets/icons/StartRecordingIcon";
import RestartRecordingIcon from "@assets/icons/RestartRecordingIcon";

type Props = {
  startUserRecording: () => void;
  stopUserRecording: () => void;
  restartRecording: () => void;
  audioUrl?: string;
  status: string;
};

const SpeakingTestRecord: React.FC<Props> = ({
  startUserRecording,
  stopUserRecording,
  restartRecording,
  audioUrl,
  status,
}) => {
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);

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

  const handleRestartRecording = () => {
    restartRecording();
    setIsRecorded(false); // 재녹음
  };

  return (
    <>
      {/* 아무것도 녹음되지 않은 상태 */}
      {!isRecording && !isRecorded && (
        <>
          <StartRecordingIcon onClick={startUserRecording} />
          <PromptText>마이크 버튼을 눌러 녹음을 시작하세요.</PromptText>
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
          <CompletionText>녹음이 완료되었습니다!</CompletionText>
          {audioUrl && <AudioPlayer controls src={audioUrl} />}
          <RestartRecordingIconStyled onClick={handleRestartRecording} />
          <RestartText>다시 녹음하기</RestartText>
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

const RecordingContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StopButton = styled.div`
  width: 5rem;
  height: 2rem;
  background-color: red;
  color: white;
  text-align: center;
  line-height: 2rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 1rem;
`;

const RecordingTime = styled.div`
  margin-top: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
`;

const RecordingStatus = styled.div`
  color: red;
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 0.5rem;
`;

// 녹음 완료 시 텍스트 스타일
const CompletionText = styled.p`
  color: ${(props) => props.theme.colors.success};
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

// 오디오 플레이어 스타일
const AudioPlayer = styled.audio`
  margin: 1rem 0;
  width: 100%;
  max-width: 20rem;
`;

// 재녹음 아이콘 스타일
const RestartRecordingIconStyled = styled(RestartRecordingIcon)`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    opacity: 0.8;
  }
`;

// 재녹음 텍스트 스타일
const RestartText = styled.p`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// 녹음 전 프롬프트 텍스트
const PromptText = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 1.125rem;
  margin-top: 0.5rem;
`;
