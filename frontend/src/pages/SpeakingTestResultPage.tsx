import React, { useEffect, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import SpeakingTestResultReference from "@components/SpeakingTestResultReference";
import SpeakingTestResultCharts from "@components/SpeakingTestResultCharts";
import SpeakingTestResultInfoWidget from "@components/SpeakingTestResultInfoWidget";

import styled from "styled-components";

import BackArrow from "@assets/icons/BackArrow";

const SpeakingTestResultPage: React.FC = () => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    import.meta.env.VITE_SPEECH_API_KEY,
    import.meta.env.VITE_SPEECH_REGION
  );

  const reference_text =
    "Today was a beautiful day. We had a great time taking a long walk outside in the morning. The sun was shining brightly, and a gentle breeze made the weather feel perfect. As we strolled through the park, we noticed the trees swaying softly, and the sound of birds chirping filled the air.";
  const reference_text_translate =
    "오늘은 정말 아름다운 날이었어. 우리는 아침에 긴 산책을 하며 즐거운 시간을 보냈어. 해가 밝게 빛나고, 부드러운 바람이 날씨를 완벽하게 만들어줬어. 공원을 걷다가 나무들이 부드럽게 흔들리는 것을 봤고, 새들이 지저귀는 소리가 공기를 가득 채웠어.";

  const setCurrentLocation = useSetRecoilState(locationState);
  useEffect(() => {
    setCurrentLocation("Speaking Test Result Page");
  }, [setCurrentLocation]);

  const [isSpeaking, setIsSpeaking] = useState(false); // 음성 재생 상태

  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

  // 음성 재생 핸들러
  const handleRead = (sentence: string) => {
    if (isSpeaking) return;

    setIsSpeaking(true);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      sentence,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("Synthesis completed.");
        }
        synthesizer.close();
        setIsSpeaking(false); // 음성 재생 완료 후 상태 업데이트
      },
      (err) => {
        console.error("Error: ", err);
        synthesizer.close();
        setIsSpeaking(false); // 에러 발생 시 상태 해제
      }
    );
  };

  const testResults = {
    pronunciationScore: 100,
    accuracyScore: 100,
    fluencyScore: 100,
    prosodyScore: 100,
    completenessScore: 100,
  };

  // 점수 평가 함수
  function getAccuracyFeedback(score: number) {
    if (score < 60) {
      return "발음이 전반적으로 부정확하며, 기본적인 음소와 단어의 발음을 개선할 필요가 있습니다. 꾸준한 연습을 통해 발음을 더 정확하게 교정하는 것이 필요합니다.";
    } else if (score < 70) {
      return "발음이 부족한 부분이 있습니다. 특히 특정 음소나 단어에서 발음이 명확하지 않으므로, 구체적인 발음 연습이 필요합니다.";
    } else if (score < 80) {
      return "발음이 대체로 정확하지만, 몇 가지 발음에서 불명확한 부분이 있습니다. 발음의 일관성을 더 높이기 위한 연습이 필요합니다.";
    } else if (score < 90) {
      return "발음이 대부분 정확합니다. 발음이 원어민에 가깝지만, 몇몇 미세한 부분에서 개선할 수 있습니다.";
    } else if (score <= 100) {
      return "발음이 매우 정확하며, 원어민과 거의 차이가 없습니다. 발음의 정밀함이 뛰어납니다.";
    }
  }

  // FluencyScore 피드백
  function getFluencyFeedback(score: number) {
    if (score < 60) {
      return "유창성이 부족하여 말의 흐름이 자주 끊깁니다. 더 자연스럽게 말하기 위해서는 연속적인 문장 연습이 필요합니다.";
    } else if (score < 70) {
      return "말의 흐름이 다소 부자연스럽고 중간중간 멈춤이 있습니다. 좀 더 부드럽고 자연스러운 말하기를 연습하세요.";
    } else if (score < 80) {
      return "발음이 대체로 유창하지만, 몇몇 구간에서 끊기거나 멈추는 부분이 있어 더 자연스럽게 말할 필요가 있습니다.";
    } else if (score < 90) {
      return "대부분의 발음이 유창하며, 자연스럽게 연결됩니다. 간혹 미세한 흐름의 끊김이 있을 수 있으나 전반적으로 매우 좋습니다.";
    } else if (score <= 100) {
      return "유창성이 매우 뛰어나며, 말의 흐름이 원어민처럼 자연스럽습니다.";
    }
  }

  // ProsodyScore 피드백
  function getProsodyFeedback(score: number) {
    if (score < 60) {
      return "운율이 부자연스럽고, 억양과 리듬에서 많이 부족합니다. 억양과 강세를 연습해 더 자연스러운 발음을 만들어 보세요.";
    } else if (score < 70) {
      return "운율이 다소 어색하며, 억양과 리듬이 부자연스럽습니다. 좀 더 자연스러운 리듬과 억양을 위해 연습이 필요합니다.";
    } else if (score < 80) {
      return "운율이 괜찮지만, 몇몇 구간에서 억양이 어색할 수 있습니다. 조금 더 자연스러운 강세와 억양을 유지해보세요.";
    } else if (score < 90) {
      return "발음의 운율이 전반적으로 자연스럽고 강세와 리듬이 적절합니다. 억양이 약간 부자연스러운 부분이 있을 수 있지만 매우 좋습니다.";
    } else if (score <= 100) {
      return "운율이 매우 자연스러우며, 억양, 강세, 말하기 속도와 리듬 모두에서 원어민과 비슷합니다.";
    }
  }

  // CompletenessScore 피드백
  function getCompletenessFeedback(score: number) {
    if (score < 60) {
      return "많은 단어가 누락되거나 불완전하게 발음되었습니다. 텍스트를 읽을 때 주의 깊게 발음하는 연습이 필요합니다.";
    } else if (score < 70) {
      return "일부 단어가 누락되거나 발음이 불완전합니다. 텍스트를 천천히 읽으면서 발음을 교정하는 것이 좋습니다.";
    } else if (score < 80) {
      return "대부분의 단어가 발음되었으나 몇몇 단어에서 발음 누락이나 불완전함이 있었습니다.";
    } else if (score < 90) {
      return "거의 모든 단어가 완전하게 발음되었습니다. 발음의 정확도가 좋습니다.";
    } else {
      return "모든 단어를 완벽히 발음했습니다. 텍스트를 매우 정확하고 완전하게 구사하고 있습니다.";
    }
  }

  return (
    <MainLayout>
      <MainContainer>
        <BackHeader>
          <BackArrow />
          평가 리스트로 돌아가기
        </BackHeader>
        <SpeakingTestResultCharts results={testResults} />
        <GridContainer>
          <SpeakingTestResultInfoWidget
            title="AccuracyScore"
            estimate={getAccuracyFeedback(testResults.accuracyScore)}
            content="음성의 발음 정확도입니다. 정확도는 음소가 원어민의 발음에 얼마나 근접하게 일치하는지를 나타냅니다. 음절, 단어 및 전체 텍스트 정확도 점수는 음소 수준 정확도 점수에서 집계되고 평가 목표를 사용하여 구체화됩니다."
          />
          <SpeakingTestResultInfoWidget
            title="FluencyScore"
            estimate={getFluencyFeedback(testResults.fluencyScore)}
            content="지정된 음성의 능숙도입니다. 능숙도는 음성이 원어민이 사용하는 단어 사이의 무음 분리에 얼마나 근접하게 일치하는지를 나타냅니다."
          />
          <SpeakingTestResultInfoWidget
            title="ProsodyScore"
            estimate={getProsodyFeedback(testResults.prosodyScore)}
            content="지정된 음성의 운율입니다. 운율은 강세, 억양, 말하기 속도 및 리듬을 포함하여 주어진 음성이 얼마나 자연스러운지를 나타냅니다."
          />
          <SpeakingTestResultInfoWidget
            title="CompletenessScore"
            estimate={getCompletenessFeedback(testResults.completenessScore)}
            content="입력 참조 텍스트에 대한 발음 단어의 비율로 계산된 음성의 완전성입니다. 만약 점수가 낮게 나왔다면, 놓치지 않은 문장이 없는지 살펴보세요."
          />
        </GridContainer>
      </MainContainer>
      <MainContainer>
        <SpeakingTestResultReference
          referenceTest={reference_text}
          referenceTextTranslate={reference_text_translate}
          handleRead={handleRead}
          isSpeaking={isSpeaking}
        />
      </MainContainer>
    </MainLayout>
  );
};

export default SpeakingTestResultPage;

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 90%;
  min-height: 50rem;

  margin: 0 0.5rem;
  padding: 0.5rem;

  background-color: ${(props) => props.theme.colors.cardBackground + "BF"};
  box-shadow: 0.5rem 0.5rem 0.25rem ${(props) => props.theme.colors.shadow};

  border-radius: 0.75rem;

  transition: box-shadow 0.5s;

  backdrop-filter: blur(0.25rem);
`;

const BackHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-left: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
`;

const MainLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;

  width: 95%;
`;
