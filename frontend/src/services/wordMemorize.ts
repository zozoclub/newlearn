import axiosInstance from "./axiosInstance";

// 단어 리스트 조회 Dto
export type MemorizeWordListResponseDto = {
    wordId : number
    word : string
    wordMeaning : string
    isComplete : boolean
} 

export const getMemorizeWordList = async (): Promise<
    MemorizeWordListResponseDto[]
    > => {
    try {
        const response = await axiosInstance.get(`word`);
        console.log(response);
        
        return response.data.data
    } catch (error) {
        console.error("단어 리스트 조회 오류", error);
        
        throw error
    }
};

// 단어 외움 처리 토글
export const postMemorizeWord = async (wordId:number): Promise<void> => {
    try {
        const response = await axiosInstance.post(`word/${wordId}/complete`)
        console.log(response);

        return response.data.data
    } catch (error) {
        console.error("외움 처리 오류", error);
        
        throw error
    }
}

// 단어 삭제
export const deleteMemorizeWord = async (wordId: number): Promise<void> => {
    try {
        const response = await axiosInstance.delete(`word/${wordId}`)
        console.log(response);

        return response.data.data
    } catch (error) {
        console.error("단어 삭제 오류", error);
        
        throw error
    }
}

// 단어 상세 조회 Response Dto
export type WordDetailResponseDto = {
    word : string
    wordMeaning : string
    sentences : Array<{
        newsId : number
        difficulty : number
        sentence : string
        sentenceMeaning : string
    }>
}

// 단어 상세 조회
export const getWordDetail = async (word:string): Promise<WordDetailResponseDto> => {
    try {
        const response = await axiosInstance.get(`word/${word}`)
        console.log(response);
        
        return response.data.data
    } catch (error) {
        console.log("단어 상세 조회 오류", error);
        
        throw error
    }
}