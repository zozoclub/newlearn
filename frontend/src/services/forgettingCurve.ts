import axiosInstance from "./axiosInstance";

export type ForgettingCurveWordListResponseDto = {
    wordId : number;
    word: string;
    sentence : string;
    sentenceMeaning: string;
    wordNowLevel : number;
}

// 망각 곡선 문제 받기
export const getForgettingCurveWordList = async (): Promise<ForgettingCurveWordListResponseDto[]> => {
    try {
        console.log("망각 실행");
        
        const response = await axiosInstance.get(`word/restudy`)
        console.log(response.data.data);

        return response.data.data
    } catch (error) {
        console.error("망각 오류", error);
        
        throw error
    }
}

// 망각 곡선에서 삭제
export const postCompleteCurveWord = async (wordId: number): Promise<void> => {
    try {
        console.log("망각 삭제 시도");
        const response = await axiosInstance.post(`word/restudy/complete/${wordId}`)
        console.log(response);
        console.log("망각 삭제 완료");
        
    } catch (error) {
        console.log("망각 삭제 실패", error);
        
    }
}

// 망각 곡선 하루 스킵
export const postSkipCurveWord = async (wordId : number): Promise<void> => {
    try {
        console.log("망각 스킵 시도");
        const response = await axiosInstance.post(`word/restudy/skip/${wordId}`)
        console.log(response);
        console.log("망각 스킵 완료");
        
        
    } catch (error) {
        console.log("망각 스킵 실패", error);
        
    }
}

// 망각 결과 (저장 및 닫기)
export type SaveForgettingCurveWordRequestDto = {
    wordId : number;
    isDoing: boolean;
    isCorrect: boolean;
}

export const postSaveForgettingCurveWord = async (saveData:SaveForgettingCurveWordRequestDto[]) : Promise<void> => {
    try {
        console.log("결과 전달 데이터",saveData);
        const response = await axiosInstance.post(`word/restudy/exit`,saveData)
        console.log(response);
        
    } catch (error) {
        console.log("결과 전달 실패", error);
        
    }
}