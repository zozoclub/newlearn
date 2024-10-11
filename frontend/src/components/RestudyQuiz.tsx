import React, { useEffect, useState } from "react";
import RestudyQuizModal from "@components/RestudyQuizModal";
import RestudyQuizList from "@components/RestudyQuizList";
import { useQuery } from "@tanstack/react-query";
import {
  getForgettingCurveWordList,
  ForgettingCurveWordListResponseDto,
} from "@services/forgettingCurve";

const RestudyQuiz: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRestudyData, setNewRestudyData] = useState<
    ForgettingCurveWordListResponseDto[]
  >([]);

  const { data: questions } = useQuery<ForgettingCurveWordListResponseDto[]>({
    queryKey: ["forgettingCurveQuestions"],
    queryFn: getForgettingCurveWordList,
  });

  useEffect(() => {
    if (questions && questions.length > 0) {
      setIsModalOpen(true);
      setNewRestudyData(questions);
    }
  }, [questions]);

  return (
    <>
      <RestudyQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pop Quiz"
      >
        <RestudyQuizList
          onClose={() => setIsModalOpen(false)}
          newRestudyData={newRestudyData}
        />
      </RestudyQuizModal>
    </>
  );
};

export default RestudyQuiz;
