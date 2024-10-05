import React, { useEffect, useState } from "react";
import RestudyQuizModal from "@components/RestudyQuizModal";
import RestudyQuizList from "@components/RestudyQuizList";
import { useQuery } from "@tanstack/react-query";
import { getForgettingCurveWordList, ForgettingCurveWordListResponseDto } from "@services/forgettingCurve";

const RestudyQuiz: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // getForgettingCurveWordList로 데이터를 불러옴
  const { data: questions } = useQuery<ForgettingCurveWordListResponseDto[]>({
    queryKey: ["forgettingCurveQuestions"],
    queryFn: getForgettingCurveWordList,
  });

  useEffect(() => {
    if (questions && questions.length > 0) {
      setIsModalOpen(true);
    }
  }, [questions]);

  return (
    <>
      {/* 모달 컴포넌트 */}
      <RestudyQuizModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="퀴즈">
        {/* props로 questions 데이터를 전달 */}
        <RestudyQuizList onClose={() => setIsModalOpen(false)} questions={questions} />
      </RestudyQuizModal>
    </>
  );
};

export default RestudyQuiz;
