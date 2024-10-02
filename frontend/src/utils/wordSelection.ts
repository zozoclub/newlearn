import { useCallback } from "react";

type SelectionResult = {
  word: string;
  englishSentence: string;
  koreanSentence: string;
};

// 선택된 단어가 완전한 단어인지 확인하는 함수
const isCompleteWord = (node: Node, range: Range): boolean => {
  const nodeText = node.textContent || "";
  const selectionStart = range.startOffset;
  const selectionEnd = range.endOffset;

  const beforeChar = nodeText[selectionStart - 1];
  const isStartOfWord = !beforeChar || /\W/.test(beforeChar); // 비단어 문자 확인

  const afterChar = nodeText[selectionEnd];
  const isEndOfWord = !afterChar || /\W/.test(afterChar); // 비단어 문자 확인

  return isStartOfWord && isEndOfWord;
};

// 선택된 텍스트가 유효한 단어인지 확인하는 함수
const isValidWord = (word: string): boolean => {
  return /^[a-zA-Z가-힣]+$/.test(word);
};

// 영어와 한글 문장을 추출하는 함수
const extractSentences = (
  engText: string,
  korData: string,
  word: string
): { engSentence: string | null; korSentence: string | null } => {
  const sentenceRegex = new RegExp(`[^.!?]*\\b${word}\\b[^.!?]*[.!?]`, "gi"); // 단어가 포함된 문장을 찾기 위한 정규식
  const engMatch = engText.match(sentenceRegex);

  if (engMatch) {
    const engSentence = engMatch[0].trim();

    // 영어와 한글 문장을 구두점까지 포함해서 나눔
    const korSentences = korData.match(/[^.!?]*[.!?]/g); // 한글 문장을 구두점 포함해서 나눔
    const engSentences = engText.match(/[^.!?]*[.!?]/g); // 영어 문장을 구두점 포함해서 나눔

    if (engSentences && korSentences) {
      // 영어 문장에서 매칭된 문장의 인덱스를 찾음
      const engSentenceIndex = engSentences.findIndex((sentence) =>
        sentence.includes(engSentence)
      );

      if (engSentenceIndex !== -1 && korSentences[engSentenceIndex]) {
        return {
          engSentence,
          korSentence: korSentences[engSentenceIndex].trim(),
        };
      }
    }
  }

  return { engSentence: null, korSentence: null };
};

// 단어 선택과 문장 추출을 처리하는 커스텀 훅
export const useWordSelection = (korData: string) => {
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const word = selection.toString().trim();

    if (
      !isValidWord(word) ||
      word.length === 0 ||
      !isCompleteWord(range.startContainer, range)
    ) {
      return null;
    }

    const engText = range.startContainer.textContent || "";

    // 문장을 추출
    const sentences = extractSentences(engText, korData, word);

    if (sentences.engSentence && sentences.korSentence) {
      const result: SelectionResult = {
        word,
        englishSentence: sentences.engSentence,
        koreanSentence: sentences.korSentence,
      };

      return result;
    }

    return null;
  }, [korData]);

  return { handleSelectionChange };
};
