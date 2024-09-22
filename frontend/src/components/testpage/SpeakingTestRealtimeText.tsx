import React from "react";
import styled from "styled-components";

type Props = {
  isExplainText: boolean;
  userRecognizingText: string;
  userRecognizedText: string;
  status: string;
};

const SpeakingTestRealtimeText: React.FC<Props> = ({
  userRecognizingText,
  userRecognizedText,
  isExplainText,
  status, // status로 녹음 상태를 확인
}) => {
  // userRecognizedText를 '. ' 기준으로 나눔
  const splitRecognizedText = userRecognizedText
    .split(". ")
    .map((sentence) => sentence.trim());

  return (
    <>
      {!isExplainText ? (
        <div>
          {status === "recording" ? (
            userRecognizingText ? (
              <RecognizingText>
                인식된 텍스트
                {userRecognizingText}
              </RecognizingText>
            ) : (
              <InstructionText>실시간 텍스트가 출력됩니다.</InstructionText>
            )
          ) : userRecognizedText ? (
            <FinalText>
              <RecognizingText>최종 인식된 텍스트</RecognizingText>
              <Explain>
                인식된 텍스트는 문장의 완성도 점수에서 확인 가능합니다. 문단이
                제대로 나누어지지 않아도 점수에는 큰 영향 없습니다.
              </Explain>
              {splitRecognizedText.map((sentence, index) => (
                <span key={index}>
                  {sentence}
                  {index !== splitRecognizedText.length - 1 && "."}
                  <br />
                  <br />
                </span>
              ))}
            </FinalText>
          ) : null}
        </div>
      ) : (
        <Instructions>
          <li>녹음이 시작된 후 1초 뒤에 발음을 시작하세요.</li>
          <li>주변 소음을 최소화해주세요.</li>
          <li>일정 시간 동안 소리가 감지되지 않으면 중지될 수 있습니다.</li>
          <li>녹음이 끝나면 정지 버튼을 눌러주세요.</li>
        </Instructions>
      )}
    </>
  );
};

export default SpeakingTestRealtimeText;

const RecognizingText = styled.p`
  margin-bottom: 1rem;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.5rem;
  font-weight: 600;
`;

const FinalText = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 600;
`;

const InstructionText = styled.p`
  color: ${(props) => props.theme.colors.text01};
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
`;

const Instructions = styled.ul`
  list-style: none;
  padding: 1rem;
  margin: 0;
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.75rem;

  li {
    margin-bottom: 1rem;
    &:before {
      content: "✓";
      margin-right: 0.5rem;
      color: ${(props) => props.theme.colors.text01};
    }
  }
`;

const Explain = styled.div`
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text04};
`;
