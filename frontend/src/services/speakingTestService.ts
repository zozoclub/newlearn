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

export type PronounceTestResponseDto = {
  audioFileId : number
}

// FormData로 파일과 데이터를 함께 전송
export const postPronounceTestResult = async (
  pronounceTestResultDataSet: PronounceTestRequestDto
): Promise<PronounceTestResponseDto> => {
  console.log(pronounceTestResultDataSet);

  // FormData 객체 생성
  const formData = new FormData();
  
  // FormData에 파일과 다른 데이터를 추가
  formData.append('files', pronounceTestResultDataSet.files);
  // sentenceIds 배열을 개별 항목으로 추가
  pronounceTestResultDataSet.sentenceIds.forEach((id) => {
    formData.append('sentenceIds', id.toString());
  });
  formData.append('accuracyScore', pronounceTestResultDataSet.accuracyScore.toString());
  formData.append('fluencyScore', pronounceTestResultDataSet.fluencyScore.toString());
  formData.append('completenessScore', pronounceTestResultDataSet.completenessScore.toString());
  formData.append('prosodyScore', pronounceTestResultDataSet.prosodyScore.toString());
  formData.append('totalScore', pronounceTestResultDataSet.totalScore.toString());
  
  try {
    // FormData 내용 확인
    formData.forEach((value, key) => {
    console.log(`${key}: ${value}`)
    });
    const response = await axiosInstance.post(
      `study/pronounce/test`,
      formData,
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
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore: number;
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
  createdAt: string;
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
    const response = await axiosInstance.get(`study/pronounce/${audioFileId}`);
    console.log(response);

    return response.data.data;
  } catch (error) {
    console.error("발음 테스트 결과 리스트 조회 오류", error);

    throw error;
  }
};
