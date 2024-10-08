import React, { useState, useEffect } from "react";
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
  status,
}) => {
  const [isModalTop, setIsModalTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      console.log("Current scroll position:", scrollPosition); // 스크롤 위치 디버깅

      // 스크롤 위치에 따라 모달의 위치를 업데이트
      if (scrollPosition > 300) {
        setIsModalTop(true);
        console.log("위로");
      } else {
        setIsModalTop(false);
        console.log("아래로");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const splitRecognizedText = userRecognizedText
    .split(". ")
    .map((sentence) => sentence.trim());

  return (
    <>
      {!isExplainText ? (
        <div>
          {status === "recording" ? (
            <FixedModalContainer $isTop={isModalTop}>
              <ModalContent>
                {userRecognizingText ? (
                  <RecognizingText>
                    인식된 텍스트
                    <br />
                    <FinalText>{userRecognizingText}</FinalText>
                    <br />
                    <br />
                  </RecognizingText>
                ) : (
                  <>
                    <InstructionText>
                      실시간 텍스트가 출력됩니다.
                    </InstructionText>
                    <br />
                    <br />
                    <Explain>
                      발음 시 본 화면이 바뀌지 않는다면, 마이크 설정을 확인해
                      주세요.
                    </Explain>
                  </>
                )}
              </ModalContent>
            </FixedModalContainer>
          ) : userRecognizedText ? (
            <FinalText>
              <RecognizingText>최종 인식된 텍스트</RecognizingText>
              {splitRecognizedText.map((sentence, index) => (
                <span key={index}>
                  {sentence}
                  {index !== splitRecognizedText.length - 1 && "."}
                  <br />
                  <br />
                </span>
              ))}
            </FinalText>
          ) : (
            <RecognizedContainer>
              <NoText>최종 인식된 텍스트가 없습니다.</NoText>
              <br />
              <Explain>녹음된 음성을 확인해주세요.</Explain>
            </RecognizedContainer>
          )}
        </div>
      ) : (
        <TipContainer>
          <Tip>Record Tips</Tip>
          <Instructions>
            <li>시작 후 1초 뒤에 발음을 시작하세요.</li>
            <li>조용한 환경에서 녹음을 진행해 주세요.</li>
            <li>녹음이 끝나면 정지 버튼을 눌러주세요.</li>
            <li>음성이 감지되지 않으면 중지될 수 있습니다.</li>
          </Instructions>
        </TipContainer>
      )}
    </>
  );
};

export default SpeakingTestRealtimeText;

const FixedModalContainer = styled.div<{ $isTop: boolean }>`
  position: fixed;
  left: 50%;
  transform: translateX(-50%)
    translateY(${(props) => (props.$isTop ? "-100%" : "0%")});
  bottom: ${(props) => (props.$isTop ? "auto" : "10%")};
  top: ${(props) => (props.$isTop ? "35%" : "auto")};
  transition: transform 0.5s ease, top 0.5s ease, bottom 0.5s ease; /* 부드러운 이동 애니메이션 */
  margin: auto;
  width: 300px;
  z-index: 1000;
  pointer-events: none;
`;

const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  pointer-events: auto; /* 모달 내부는 여전히 상호작용 가능 */
  width: 100%;
`;

const RecognizingText = styled.div`
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.text};
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
`;

const FinalText = styled.div`
  margin: auto;
  width: 90%;
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  margin-top: 1.5rem;
`;

const InstructionText = styled.p`
  color: ${(props) => props.theme.colors.text01};
  font-size: 1.125rem;
  font-weight: 500;
  text-align: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Instructions = styled.ul`
  list-style: none;
  padding: 0.75rem;
  margin: 0;
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  line-height: 1.4rem;

  li {
    margin-bottom: 1rem;
    &:before {
      content: "✓";
      margin-right: 0.75rem;
      color: ${(props) => props.theme.colors.primary}; /* 초록색 체크마크 */
      font-size: 1rem;
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
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  margin-top: 1.5rem;
  padding: 1rem;
`;

const Tip = styled.div`
  margin-top: 1rem;
  font-size: 1.125rem;
  font-weight: 700;
`;

const TipContainer = styled.div`
  width: 80%;
  padding: 0 1rem;
  border-radius: 1rem;
  background-color: ${(props) => props.theme.colors.highliting + "2A"};
`;

const RecognizedContainer = styled.div`
  width: 100%;
  border-radius: 1rem;
  background-color: ${(props) => props.theme.colors.highliting + "2A"};
`;
