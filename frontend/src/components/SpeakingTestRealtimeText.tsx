import React from "react";

type Props = {
  isExplainText: boolean;
  userRecognizingText: string;
  userRecognizedText: string;
};

const SpeakingTestRealtimeText: React.FC<Props> = ({
  userRecognizingText,
  userRecognizedText,
  isExplainText,
}) => {
  return (
    <>
      {!isExplainText ? (
        <div>
          <h2>Recognizing Text: {userRecognizingText}</h2>
          <h3>Final Recognized Text: {userRecognizedText}</h3>
        </div>
      ) : (
        <ul>
          <li>녹음을 시작하고 1초 뒤에 발화를 시작하세요.</li>
          <br />
          <li>주변 소음을 최소화 해주세요.</li>
          <br />
          <li>일정시간 초과 시 중지될 수 있습니다.</li>
          <br />
          <li>녹음을 완료하면 정지 버튼을 눌러주세요.</li>
          <br />
        </ul>
      )}
    </>
  );
};

export default SpeakingTestRealtimeText;
