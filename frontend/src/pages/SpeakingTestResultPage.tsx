import React, { useEffect, useState, useMemo } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import locationState from "@store/locationState";
import SpeakingTestResultReference from "@components/testpage/SpeakingTestResultReference";
import SpeakingTestResultCharts from "@components/testpage/SpeakingTestResultCharts";
import SpeakingTestResultInfoWidget from "@components/testpage/SpeakingTestResultInfoWidget";
import { getPronounceTestResultDetail, PronounceTestResultDetailDto } from "@services/speakingTestService";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@components/Spinner";
import styled from "styled-components";
import BackArrow from "@assets/icons/BackArrow";
import { getAccuracyFeedback, getCompletenessFeedback, getFluencyFeedback, getProsodyFeedback } from "@utils/speakingFeedback";

const SpeakingTestResultPage: React.FC = () => {
  const { audioFileId } = useParams<{ audioFileId: string }>(); 
  const setCurrentLocation = useSetRecoilState(locationState);
  const [synthesizer, setSynthesizer] = useState<sdk.SpeechSynthesizer | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setCurrentLocation("Speaking Test Result Page");
  }, [setCurrentLocation]);

  const { data: testDetail, isLoading, error } = useQuery<PronounceTestResultDetailDto>({
    queryKey: ["pronounceTestDetail", audioFileId],
    queryFn: () => getPronounceTestResultDetail(Number(audioFileId)),
  });

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

    // 기존 synthesizer가 있다면 닫고 새로 생성
    if (synthesizer) {
      synthesizer.close();
    }

    const newSynthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    setSynthesizer(newSynthesizer);

    newSynthesizer.speakTextAsync(
      sentence,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("Synthesis completed.");
        }
        newSynthesizer.close(); // 완료 후 해제
        setIsSpeaking(false); // 음성 재생 완료 후 상태 업데이트
        setSynthesizer(null); // 사용 완료 후 synthesizer를 null로 설정
      },
      (err) => {
        console.error("Error: ", err);
        newSynthesizer.close();
        setIsSpeaking(false); // 에러 발생 시 상태 해제
        setSynthesizer(null); // 에러 발생 시 synthesizer를 null로 설정
      }
    );
  };

  // 컴포넌트 언마운트 시 synthesizer 닫기
  useEffect(() => {
    return () => {
      if (synthesizer) {
        try {
          synthesizer.close(); // synthesizer가 존재할 때만 close() 호출
        } catch (error) {
          console.error("Error closing synthesizer:", error);
        }
      }
    };
  }, [synthesizer]);

  // useMemo로 캐싱하여 불필요한 객체 생성 방지
  const results = useMemo(() => {
    return testDetail ? {
      pronunciationScore: testDetail.totalScore,
      accuracyScore: testDetail.accuracyScore,
      fluencyScore: testDetail.fluencyScore,
      prosodyScore: testDetail.prosodyScore,
      completenessScore: testDetail.completenessScore,
    } : null;
  }, [testDetail]);

  // 로딩 상태 처리
  if (isLoading) return <Spinner />;

  // 에러 상태 처리
  if (error) return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  // testDetail이 null일 때
  if (!testDetail || !results) return <ErrorText>No data available.</ErrorText>;

  const referenceTest = testDetail.tests.map(test => test.sentence).join(" ");
  const referenceTextTranslate = testDetail.tests.map(test => test.sentenceMeaning).join(" ");

  return (
    <MainLayout>
      <MainContainer>
        <BackHeader>
          <BackArrow width={48} height={48} />
          평가 리스트로 돌아가기
        </BackHeader>
        
        {/* 차트 컴포넌트는 results가 변경되지 않으면 리렌더링되지 않음 */}
        <SpeakingTestResultCharts results={results} />

        <GridContainer>
          <SpeakingTestResultInfoWidget
            title="AccuracyScore"
            estimate={getAccuracyFeedback(results.accuracyScore)}
            content="음성의 발음 정확도입니다."
          />
          <SpeakingTestResultInfoWidget
            title="FluencyScore"
            estimate={getFluencyFeedback(results.fluencyScore)}
            content="지정된 음성의 능숙도입니다."
          />
          <SpeakingTestResultInfoWidget
            title="ProsodyScore"
            estimate={getProsodyFeedback(results.prosodyScore)}
            content="지정된 음성의 운율입니다."
          />
          <SpeakingTestResultInfoWidget
            title="CompletenessScore"
            estimate={getCompletenessFeedback(results.completenessScore)}
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
