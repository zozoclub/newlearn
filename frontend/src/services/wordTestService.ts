import axiosInstance from "./axiosInstance";

// 단어 테스트 문제 Dto
export type WordTestList = {
  word: string;
  wordMeaning: string;
  sentence: string;
  sentenceMeaning: string;
};

// 단어 테스트 문제 요청하기
export const getWordTestList = async (
  totalCount: number
): Promise<WordTestList[]> => {
  try {
    console.log(totalCount);

    const response = await axiosInstance.get(`study/word/test`, {
      params: {
        totalCount: totalCount,
      },
    });
    console.log(response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("단어 문제 획득 오류", error);

    throw error;
  }
};

// 단어 문장 빈칸 테스트 결과 저장 Dto
export type WordTestRequestDto = {
  quiz_id: number; // 퀴즈 ID (word_quiz 테이블의 ID)
  results: [
    {
      sentence: string; // 문장 (word_quiz_question)
      correctAnswer: string; // 정답 (word_quiz_question)
      answer: string; // 사용자의 답안 (word_quiz_answer)
      isCorrect: boolean; // 정답 여부 (word_quiz_answer)
    },
    {
      sentence: string;
      correctAnswer: string;
      answer: string;
      isCorrect: boolean;
    }
  ];
};

// 단어 문장 빈칸 테스트 결과
export type WordTestResponseDto = {
  quizId: number;
};

// 단어 문장 빈칸 테스트 결과 저장하기
export const postWordTestResult = async (
  wordTestwordTestResultDataSet: WordTestRequestDto
): Promise<WordTestResponseDto> => {
  try {
    const response = await axiosInstance.post(`study/word/test`, {
      wordTestwordTestResultDataSet,
    });

    return response.data.data;
  } catch (error) {
    console.error("단어 문장 빈칸 테스트 결과 저장 오류", error);

    throw error;
  }
};

// 단어 결과 리스트 Dto
export type WordTestResultListResponse = {
  quizId: number;
  answer: string;
  totalCount: string;
  correctCount: boolean;
  createAt: string;
};

// 단어 결과 리스트 출력하기
export const getWordTestResultList = async (): Promise<
  WordTestResultListResponse[]
> => {
  try {
    const response = await axiosInstance.get(`study/word/test/list`);

    return response.data.data;
  } catch (error) {
    console.error("단어 문제 결과 리스트 획득 오류", error);

    throw error;
  }
};

// 단어 문장 빈칸 테스트 결과 상세 조회 Dto
export type WordTestResultDetailResponseDto = {
  quizId: number;
  results: Array<{
    sentence: string;
    correctAnswer: string;
    answer: string;
    isCorrect: boolean;
  }>;
};

// 단어 문장 빈칸 테스트 결과 상세 조회
export const getWordTestResultDetail = async (
  quizId: number
): Promise<WordTestResultDetailResponseDto> => {
  try {
    console.log(quizId);

    const response = await axiosInstance.get(`study/word/test/${quizId}`);
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error("단어 문장 빈칸 테스트 결과 상세 조회 오류", error);

    throw error;
  }
};
