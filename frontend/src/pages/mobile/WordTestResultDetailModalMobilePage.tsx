import React, { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import locationState from "@store/locationState";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import WordTestCollapsible from "@components/testpage/WordTestCollapsible";

import {
  getWordTestResultDetail,
  WordTestResultDetailResponseDto,
} from "@services/wordTestService";
import Spinner from "@components/Spinner";

const WordTestResultDetailModalMobilePage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const setCurrentLocation = useSetRecoilState(locationState);

  useEffect(() => {
    setCurrentLocation("Word Test Page");
  }, [setCurrentLocation]);

  // 서버에서 데이터를 가져오기
  const {
    data: testDetail,
    isLoading,
    error,
  } = useQuery<WordTestResultDetailResponseDto>({
    queryKey: ["wordTestDetail", quizId],
    queryFn: () => getWordTestResultDetail(Number(quizId)),
  });

  const [expandedWordIndex, setExpandedWordIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedWordIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  if (isLoading) return <Spinner />;

  if (error)
    return <ErrorText>데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.</ErrorText>;

  if (!testDetail)
    return <ErrorText>결과 데이터가 없습니다.</ErrorText>;

  return (
    <MobileMainContainer>
      {testDetail.result.map((test, index) => (
        <WordTestCollapsible
          key={index}
          title={test.correctAnswer}
          isExpanded={expandedWordIndex === index}
          onToggle={() => handleToggle(index)}
        >
          <MobileSentenceDetail>
            <strong>정답:</strong> {test.correctAnswer}
          </MobileSentenceDetail>
          <MobileSentenceDetail>
            <strong>사용자 답변:</strong> {test.answer}
          </MobileSentenceDetail>
          <MobileSentenceDetail>
            <strong>문장:</strong> {test.sentence}
          </MobileSentenceDetail>
        </WordTestCollapsible>
      ))}
    </MobileMainContainer>
  );
};

export default WordTestResultDetailModalMobilePage;

const MobileMainContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MobileSentenceDetail = styled.div`
  font-size: 1rem;
  margin: 0.5rem 0;
`;

const ErrorText = styled.div`
  color: ${(props) => props.theme.colors.danger};
  font-size: 1.25rem;
  text-align: center;
`;
