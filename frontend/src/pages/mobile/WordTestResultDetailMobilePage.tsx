import React, { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Collapsible from "@components/Collapsible";
import { getWordTestResultDetail, WordTestResultDetailResponseDto } from "@services/wordTestService";
import Spinner from "@components/Spinner";

const WordTestResultMobilePage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const setCurrentLocation = useSetRecoilState(locationState);

  useEffect(() => {
    setCurrentLocation("Word Test Result Page");
  }, [setCurrentLocation]);

  const { data: testDetail, isLoading, error } = useQuery<WordTestResultDetailResponseDto[]>({
    queryKey: ["wordTestDetail", quizId],
    queryFn: () => getWordTestResultDetail(Number(quizId)),
  });

  const [expandedWordIndex, setExpandedWordIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedWordIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  if (isLoading) return <Spinner />;
  if (error) return <ErrorText>에러가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  return (
    <MainContainer>
      {testDetail?.map((test, index) => (
        <Collapsible
          key={index}
          title={test.correctAnswer}
          isExpanded={expandedWordIndex === index}
          onToggle={() => handleToggle(index)}
        >
          <SentenceDetail>
            <strong>정답:</strong> {test.correctAnswer}
          </SentenceDetail>
          <SentenceDetail>
            <strong>사용자 답변:</strong> {test.answer}
          </SentenceDetail>
          <SentenceDetail>
            <strong>문장:</strong> {test.sentence}
          </SentenceDetail>
          <SentenceDetail>
            <strong>문장 해석:</strong> {test.sentence}
          </SentenceDetail>
        </Collapsible>
      ))}
    </MainContainer>
  );
};

export default WordTestResultMobilePage;

// 스타일 정의
const MainContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SentenceDetail = styled.div`
  font-size: 1rem;
  margin: 0.5rem 0;
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;
