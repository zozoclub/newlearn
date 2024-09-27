import React, { useEffect, useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom"; // useParams로 audioFileId 가져오기
import locationState from "@store/locationState";
import SpeakingTestResultReference from "@components/testpage/SpeakingTestResultReference";
import SpeakingTestResultCharts from "@components/testpage/SpeakingTestResultCharts";
import SpeakingTestResultInfoWidget from "@components/testpage/SpeakingTestResultInfoWidget";
import { getAccuracyFeedback, getFluencyFeedback, getProsodyFeedback, getCompletenessFeedback } from "@utils/speakingFeedback";
import { getPronounceTestResultDetail, PronounceTestResultDetailDto } from "@services/speakingTestService";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@components/Spinner";
import styled from "styled-components";
import BackArrow from "@assets/icons/BackArrow";

const SpeakingTestResultPage: React.FC = () => {
  const { audioFileId } = useParams<{ audioFileId: string }>(); // audioFileId를 URL에서 가져오기
  const setCurrentLocation = useSetRecoilState(locationState);

  useEffect(() => {
    setCurrentLocation("Speaking Test Result Page");
  }, [setCurrentLocation]);

  // React Query로 발음 테스트 결과 상세 데이터를 가져옴
  const { data: testDetail, isLoading, error } = useQuery<PronounceTestResultDetailDto>(
    {
      queryKey: ["pronounceTestDetail", audioFileId],
      queryFn: () => getPronounceTestResultDetail(Number(audioFileId)),
    }
  );

  const [isSpeaking, setIsSpeaking] = useState(false);

  // 음성 합성 설정
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    import.meta.env.VITE_SPEECH_API_KEY,
    import.meta.env.VITE_SPEECH_REGION
  );
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

  // 로딩 상태 처리
  if (isLoading) return <Spinner />;

  // 에러 상태 처리
  if (error) return <ErrorText>Error fetching test results. Please try again later.</ErrorText>;

  // testDetail이 null일 때
  if (!testDetail) return <ErrorText>No data available.</ErrorText>;

  // tests 배열에서 sentence와 sentenceMeaning을 각각 join하여 하나의 문자열로 합치기
  const referenceTest = testDetail.tests.map(test => test.sentence).join(" ");
  const referenceTextTranslate = testDetail.tests.map(test => test.sentenceMeaning).join(" ");

  const results = {
    pronunciationScore: testDetail.totalScore,
    accuracyScore: testDetail.accuracyScore,
    fluencyScore: testDetail.fluencyScore,
    prosodyScore: testDetail.prosodyScore,
    completenessScore: testDetail.completenessScore,
  };

  return (
    <MainLayout>
      <MainContainer>
        <BackHeader>
          <BackArrow width={48} height={48} />
          평가 리스트로 돌아가기
        </BackHeader>
        <SpeakingTestResultCharts results={results} />
        <GridContainer>
          <SpeakingTestResultInfoWidget
            title="AccuracyScore"
            estimate={getAccuracyFeedback(testDetail.accuracyScore)}
            content="음성의 발음 정확도입니다."
          />
          <SpeakingTestResultInfoWidget
            title="FluencyScore"
            estimate={getFluencyFeedback(testDetail.fluencyScore)}
            content="지정된 음성의 능숙도입니다."
          />
          <SpeakingTestResultInfoWidget
            title="ProsodyScore"
            estimate={getProsodyFeedback(testDetail.prosodyScore)}
            content="지정된 음성의 운율입니다."
          />
          <SpeakingTestResultInfoWidget
            title="CompletenessScore"
            estimate={getCompletenessFeedback(testDetail.completenessScore)}
            content="입력 참조 텍스트에 대한 발음 단어의 비율로 계산된 음성의 완전성입니다."
          />
        </GridContainer>
      </MainContainer>
      <MainContainer>
        <SpeakingTestResultReference
          referenceTest={referenceTest}
          referenceTextTranslate={referenceTextTranslate}
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

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;
