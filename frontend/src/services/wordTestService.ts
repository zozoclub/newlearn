import axiosInstance from "./axiosInstance";

// 단어 테스트 문제 Dto
export type WordTestListResponseDto = {
  quizId: number;
  tests: Array<{
    word: string;
    wordMeaning: string;
    sentence: string;
    sentenceMeaning: string;
  }>;
};

// 단어 테스트 문제 요청하기
export const getWordTestList = async (
  totalCount: number
): Promise<WordTestListResponseDto> => {
  try {
    console.log(totalCount);

    const response = await axiosInstance.get(`study/word/test`, {
      params: {
        totalCount,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("단어 문제 획득 오류", error);

    throw error;
  }
};

// 단어 문장 빈칸 테스트 결과 저장 Dto
export type WordTestRequestDto = {
  quizId: number;
  results: Array<{
    sentence: string;
    correctAnswer: string;
    answer: string;
    isCorrect: boolean;
  }>;
};

// 단어 문장 빈칸 테스트 결과 저장하기
export const postWordTestResult = async (
  wordTestwordTestResultDataSet: WordTestRequestDto
): Promise<void> => {
  try {
    console.log("테스트 셋", wordTestwordTestResultDataSet);

    const response = await axiosInstance.post(`study/word/test`, 
      wordTestwordTestResultDataSet,
    );

    return response.data.data;
  } catch (error) {
    console.error("단어 문장 빈칸 테스트 결과 저장 오류", error);

    throw error;
  }
};

// 단어 문장 빈칸 테스트 도중 퇴장
export const deleteWordTest = async (quizId: number) : Promise<void> => {
  try {
    console.log("중도 퇴장 시도");
    const response = axiosInstance.delete(`study/word/test/exit/${quizId}`)
    console.log(response);
    
  } catch (error) {
    console.error("테스트 삭제 실패",error);
    
  }
}

// 단어 결과 리스트 Dto
export type WordTestResultListResponse = {
  quizId: number;
  totalCnt: number;
  correctCnt: number;
  createdAt: string;
};

// 단어 결과 리스트 출력하기
export const getWordTestResultList = async (): Promise<
  WordTestResultListResponse[]
> => {
  try {
    const response = await axiosInstance.get(`study/word/test/result/list`);

    return response.data.data;
  } catch (error) {
    console.error("단어 문제 결과 리스트 획득 오류", error);

    throw error;
  }
};

// 단어 문장 빈칸 테스트 결과 상세 조회 Dto
export type WordTestResultDetailResponseDto = {
  createAt: string;
  result: Array<{
    newsId: number;
    questionId: number;
    answer: string;
    correctAnswer: string;
    sentence: string;
    sentenceMeaning: string;
    correct: boolean;
  }>
};

// 단어 문장 빈칸 테스트 결과 상세 조회
export const getWordTestResultDetail = async (
  quizId: number
): Promise<WordTestResultDetailResponseDto> => {
  try {
    console.log(quizId);

    const response = await axiosInstance.get(
      `study/word/test/result/${quizId}`
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("단어 문장 빈칸 테스트 결과 상세 조회 오류", error);

    throw error;
  }
};
