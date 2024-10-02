import React, { useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import locationState from "@store/locationState";
import SpeakingTestResultReference from "@components/testpage/SpeakingTestResultReference";
import SpeakingTestResultCharts from "@components/testpage/SpeakingTestResultCharts";
import SpeakingTestResultInfoWidget from "@components/testpage/SpeakingTestResultInfoWidget";
import {
  getPronounceTestResultDetail,
  PronounceTestResultDetailDto,
} from "@services/speakingTestService";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@components/Spinner";
import styled from "styled-components";
import BackArrow from "@assets/icons/BackArrow";
import {
  getAccuracyFeedback,
  getCompletenessFeedback,
  getFluencyFeedback,
  getProsodyFeedback,
} from "@utils/speakingFeedback";

const SpeakingTestResultPage: React.FC = () => {
  const { audioFileId } = useParams<{ audioFileId: string }>();
  const setCurrentLocation = useSetRecoilState(locationState);

  useEffect(() => {
    setCurrentLocation("Speaking Test Result Page");
  }, [setCurrentLocation]);

  const {
    data: testDetail,
    isLoading,
    error,
  } = useQuery<PronounceTestResultDetailDto>({
    queryKey: ["pronounceTestDetail", audioFileId],
    queryFn: () => getPronounceTestResultDetail(Number(audioFileId)),
  });

  // useMemo로 캐싱하여 불필요한 객체 생성 방지
  const results = useMemo(() => {
    return testDetail
      ? {
          pronunciationScore: testDetail.totalScore,
          accuracyScore: testDetail.accuracyScore,
          fluencyScore: testDetail.fluencyScore,
          prosodyScore: testDetail.prosodyScore,
          completenessScore: testDetail.completenessScore,
        }
      : null;
  }, [testDetail]);

  // 로딩 상태 처리
  if (isLoading) return <Spinner />;

  // 에러 상태 처리
  if (error)
    return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  // testDetail이 null일 때
  if (!testDetail || !results) return <ErrorText>No data available.</ErrorText>;

  const referenceTest = testDetail.tests.map((test) => test.sentence).join(" ");
  const referenceTextTranslate = testDetail.tests
    .map((test) => test.sentenceMeaning)
    .join(" ");

  return (
    <MainLayout>
      <MainContainer>
        <BackHeader>
          <BackArrow width={48} height={48} url="/testhistory" />
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
          audioUrl={testDetail.audioFileUrl}
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
  box-shadow: ${(props) => props.theme.shadows.medium};
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
