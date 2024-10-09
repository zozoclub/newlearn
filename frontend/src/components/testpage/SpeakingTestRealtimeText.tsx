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
  status, // status 녹음 상태
}) => {
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
                <br />
                <RecognizedText>{userRecognizingText}</RecognizedText>
                <br />
                <br />
              </RecognizingText>
            ) : (
              <>
                <InstructionText>실시간 텍스트가 출력됩니다.</InstructionText>
                <br />
                <br />
                <Explain>
                  발음 시 본 화면이 바뀌지 않는다면, 마이크 설정을 확인해
                  주세요.
                </Explain>
              </>
            )
          ) : userRecognizedText ? (
            <FinalText>
              <RecognizingText>최종 인식된 텍스트</RecognizingText>
              <Explain>
                인식된 텍스트는 문장의 완성도 점수에서 확인 가능합니다.
                <br />
                문단이 제대로 나누어지지 않아도 점수에는 큰 영향 없습니다.
              </Explain>
              <RecognizedText>

              {splitRecognizedText.map((sentence, index) => (
                <span key={index}>
                  {sentence}
                  {index !== splitRecognizedText.length - 1 && "."}
                  <br />
                </span>
              ))}
              </RecognizedText>
            </FinalText>
          ) : (
            <>
              <NoText>최종 인식된 텍스트가 없습니다.</NoText>
              <br />
              <Explain>
                녹음된 음성을 들어보고, 소리가 나지 않는다면 마이크 상태를
                확인해 주세요.
              </Explain>
            </>
          )}
        </div>
      ) : (
        <>
          <RecognizingText>Tips</RecognizingText>
          <Instructions>
            <li>녹음이 시작된 후 1초 뒤에 발음을 시작하세요.</li>
            <li>주변 소음을 최소화해주세요.</li>
            <li>일정 시간 동안 소리가 감지되지 않으면 중지될 수 있습니다.</li>
            <li>녹음이 끝나면 정지 버튼을 눌러주세요.</li>
          </Instructions>
        </>
      )}
    </>
  );
};

export default SpeakingTestRealtimeText;

const RecognizingText = styled.p`
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.text};
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
`;

const FinalText = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.75rem;
  margin-top: 1.5rem;
`;

const InstructionText = styled.p`
  color: ${(props) => props.theme.colors.text01};
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem; /* 둥근 모서리 */
  margin-bottom: 1.5rem;
`;

const Instructions = styled.ul`
  list-style: none;
  padding: 1.25rem; /* 내부 패딩 추가 */
  margin: 0;
  color: ${(props) => props.theme.colors.text};
  font-size: 1.125rem; /* 폰트 크기 약간 크게 */
  line-height: 1.5rem; /* 줄 간격 추가 */

  li {
    margin-bottom: 1.25rem;
    &:before {
      content: "✓";
      margin-right: 0.75rem;
      color: ${(props) => props.theme.colors.primary}; /* 초록색 체크마크 */
      font-size: 1.5rem;
    }
  }
`;

const Explain = styled.div`
  margin-bottom: 1.25rem;
  font-size: 1rem; /* 폰트 크기 약간 크게 */
  color: ${(props) => props.theme.colors.text04};
  padding: 1rem;
  border-radius: 0.5rem; /* 모서리 둥글게 */
  text-align: center; /* 가운데 정렬 */
`;

const NoText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-top: 2rem; /* 상단 여백을 더 추가 */
  padding: 1rem;
`;

const RecognizedText = styled.div`
  padding: 1rem;
  font-size: 1.25rem;
`;
