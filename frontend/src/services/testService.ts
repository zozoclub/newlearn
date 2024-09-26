import axiosInstance from "./axiosInstance";

// 단어 테스트 문제 요청하기
export const getWordTestList = async (totalCount: number): Promise<void> => {
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

// Dto
export type wordTestRequestDto = {
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

// 단어 문장 빈칸 테스트 결과 저장하기
export const postWordTestResult = async (
  wordTestwordTestResultDataSet: wordTestRequestDto
): Promise<void> => {
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

// 단어 결과 리스트 출력하기
export const getWordTestResultList = async (): Promise<void> => {
  try {
    const response = await axiosInstance.get(`study/word/test/list`);

    return response.data.data;
  } catch (error) {
    console.error("단어 문제 결과 리스트 획득 오류", error);

    throw error;
  }
};

// 단어 문장 빈칸 테스트 결과 상세 조회
export const getWordTestResultDetail = async (
  quizId: number
): Promise<void> => {
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

// 발음 테스트 리스트 Dto
export type PronounceTestListDto = {
  sentence: string
  sentenceId: number
  sentenceMeaning: string
}

// 발음 테스트 예문 가져오기
export const getPronounceTestList = async (): Promise<PronounceTestListDto[]> => {
  try {
    const response = await axiosInstance.get(`study/pronounce/test`);
    console.log(response);

    return response.data.data;
  } catch (error) {
    console.error("발음 테스트 예문 가져오기 오류", error);

    throw error;
  }
};

// 발음 테스트 저장 Dto
export type PronounceTestRequestDto = {
  sentenceIds: number[]; // 문장
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number;
  totalScore: number;
  files: File;
};

// 발음 테스트 결과 저장
export const postPronounceTestResult = async (
  pronounceTestResultDataSet: PronounceTestRequestDto
): Promise<{ audioFileId: number }> => {
  console.log(pronounceTestResultDataSet);

  try {
    const response = await axiosInstance.post(
      `study/pronounce/test`,
      pronounceTestResultDataSet
    );
    console.log(response);
    console.log(response.data.data);
    console.log(response.data.message);

    return response.data.data;
  } catch (error) {
    console.error("발음 테스트 결과 저장 오류", error);

    throw error;
  }
};

export type PronounceTestResultListDto = {
  audioFileId : number
  totalScore : number
  createdAt : string
}

// 발음 테스트 결과 리스트 조회
export const getPronounceTestResultList = async (): Promise<PronounceTestResultListDto[]> => {
  try {
    const response = await axiosInstance.get(`study/pronounce/list`);
    console.log(response);

    return response.data.data;
  } catch (error) {
    console.error("발음 테스트 결과 리스트 조회 오류", error);

    throw error;
  }
};

// 발음 테스트 결과 상세 조회
export const getPronounceTestResultDetail = async (
  audioFileId: number
): Promise<void> => {
  console.log(audioFileId);

  try {
    const response = await axiosInstance.get(
      `study/pronounce/test/${audioFileId}`
    );
    console.log(response);

    return response.data.data;
  } catch (error) {
    console.error("발음 테스트 결과 리스트 조회 오류", error);

    throw error;
  }
};
