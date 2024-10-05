import axiosInstance from "./axiosInstance";

export type ForgettingCurveWordListResponseDto = {
    wordId : number;
    word: string;
    wordMeaning: string;
    sentence : string;
    sentenceMeaning: string;
    wordNowLevel : number;
}

// 망각 곡선 문제 받기
export const getForgettingCurveWordList = async (): Promise<ForgettingCurveWordListResponseDto[]> => {
    try {
        console.log("망각 실행");
        const test = [
            {
                "wordId": 34,
                "word": "important",
                "wordMeaning": "중요한//중대한//소중한//주요한",
                "sentence": "He discovered that the ends of polymer chains, which are usually ignored, are very important for controlling the structure and properties of polymers.",
                "sentenceMeaning": "그는 일반적으로 무시되는 고분자 사슬의 끝이 고분자의 구조와 특성을 제어하는 데 매우 중요하다는 것을 발견했습니다.",
                "wordNowLevel": 2
            },
            {
                "wordId": 42,
                "word": "removing",
                "wordMeaning": "이전//제거",
                "sentence": "This reminds us to think carefully about the role of animals in nature before removing them.",
                "sentenceMeaning": "이것은 동물을 제거하기 전에 자연에서 동물의 역할에 대해 신중하게 생각해야 한다는 것을 일깨워준다.",
                "wordNowLevel": 1
            },
            {
                "wordId": 43,
                "word": "purchased",
                "wordMeaning": "(격식) …을 사다//(문어) (노력하여) 얻다//…을 사기에 충분하다//구매//(종종 purchases) 물건 사기",
                "sentence": "Min-jung Seo, the eldest daughter of Amorepacific Group chairman Seo Kyung-bae, has purchased a luxury villa in Itaewon called 'Upper House Namsan' for an estimated 120 billion won.",
                "sentenceMeaning": "아모레퍼시픽그룹 서경배 회장의 장녀 서민정씨가 이태원에 위치한 럭셔리 빌라 '어퍼하우스 남산'을 약 1200억원에 매입했다.",
                "wordNowLevel": 3
            },

        ]
        return test
        const response = await axiosInstance.get(`word/restudy/check`)
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
        return
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
        return
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
        return
        const response = await axiosInstance.post(`word/restudy/exit`,saveData)
        console.log(response);
        
    } catch (error) {
        console.log("결과 전달 실패", error);
        
    }
}