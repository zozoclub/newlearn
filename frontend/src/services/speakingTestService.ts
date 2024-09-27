import axiosInstance from "./axiosInstance";

// 발음 테스트 리스트 Dto
export type PronounceTestListDto = {
  sentence: string;
  sentenceId: number;
  sentenceMeaning: string;
};

// 발음 테스트 예문 가져오기
export const getPronounceTestList = async (): Promise<
  PronounceTestListDto[]
> => {
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

// 발음 테스트 저장 Response
export type PronounceTestResponseDto = {
  audioFileId: number;
};

// 발음 테스트 결과 저장
export const postPronounceTestResult = async (
  pronounceTestResultDataSet: PronounceTestRequestDto
): Promise<PronounceTestResponseDto> => {
  console.log(pronounceTestResultDataSet);

  try {
    const response = await axiosInstance.post(
      `study/pronounce/test`,
      pronounceTestResultDataSet
    );
    console.log(response.data.message);

    return response.data.data;
  } catch (error) {
    console.error("발음 테스트 결과 저장 오류", error);

    throw error;
  }
};

export type PronounceTestResultListDto = {
  audioFileId: number;
  totalScore: number;
  createdAt: string;
};

// 발음 테스트 결과 리스트 조회
export const getPronounceTestResultList = async (): Promise<
  PronounceTestResultListDto[]
> => {
  try {
    const response = await axiosInstance.get(`study/pronounce/list`);
    console.log(response);

    return response.data.data;
  } catch (error) {
    console.error("발음 테스트 결과 리스트 조회 오류", error);

    throw error;
  }
};

// 발음 테스트 결과 상세 Dto
export type PronounceTestResultDetailDto = {
  audioFileId: number;
  audioFileUrl: string;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number;
  totalScore: number;
  createAt: string;
  tests: Array<{
    sentence: string;
    sentenceMeaning: string;
  }>;
};

// 발음 테스트 결과 상세 조회
export const getPronounceTestResultDetail = async (
  audioFileId: number
): Promise<PronounceTestResultDetailDto> => {
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