import React from "react";

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
  return (
    <>
      {!isExplainText ? (
        <div>
          {status === "recording" ? (
            userRecognizingText ? (
              <h2>Recognizing Text: {userRecognizingText}</h2>
            ) : (
              <h2>멘트치십시오</h2>
            )
          ) : userRecognizedText ? (
            <h3>Final Recognized Text: {userRecognizedText}</h3>
          ) : null}
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
