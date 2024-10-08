import { useCallback, useEffect, useState } from "react";

type SelectionResult = {
  word: string;
  englishSentence: string;
  koreanSentence: string;
};

// 선택된 단어가 완전한 단어인지 확인하는 함수
const isCompleteWord = (node: Node, start: number, end: number): boolean => {
  const nodeText = node.textContent || "";
  const beforeChar = nodeText[start - 1];
  const afterChar = nodeText[end];
  const isStartOfWord = !beforeChar || /\W/.test(beforeChar);
  const isEndOfWord = !afterChar || /\W/.test(afterChar);
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
  const sentenceRegex = new RegExp(`[^.!?]*\\b${word}\\b[^.!?]*[.!?]`, "gi");
  const engMatch = engText.match(sentenceRegex);

  if (engMatch) {
    const engSentence = engMatch[0].trim();
    const korSentences = korData.match(/[^.]*[.]/g);
    const engSentences = engText.match(/[^.]*[.]/g);

    if (engSentences && korSentences) {
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

export const useWordSelection = (engData: string, korData: string) => {
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection) {
        setSelectedText(selection.toString().trim());
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const handleSelection = useCallback((): SelectionResult | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const word = selectedText;

    if (
      !isValidWord(word) ||
      word.length === 0 ||
      !isCompleteWord(range.startContainer, range.startOffset, range.endOffset)
    ) {
      return null;
    }

    const sentences = extractSentences(engData, korData, word);

    if (sentences.engSentence && sentences.korSentence) {
      return {
        word,
        englishSentence: sentences.engSentence,
        koreanSentence: sentences.korSentence,
      };
    }

    return null;
  }, [selectedText, engData, korData]);

  return { handleSelection };
};
