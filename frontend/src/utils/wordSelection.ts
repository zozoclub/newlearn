import { useCallback, useEffect, useState } from "react";

type SelectionResult = {
  word: string;
  englishSentence: string;
  koreanSentence: string;
};

// 선택된 텍스트가 유효한 단어인지 확인하는 함수
const isValidWord = (word: string): boolean => {
  return /^[a-zA-Z가-힣]+$/.test(word);
};

// 선택된 단어가 완전한 단어인지 확인하는 함수
const isCompleteWord = (text: string, start: number, end: number): boolean => {
  const beforeChar = text[start - 1];
  const afterChar = text[end];
  const isStartOfWord = !beforeChar || /\W/.test(beforeChar);
  const isEndOfWord = !afterChar || /\W/.test(afterChar);
  return isStartOfWord && isEndOfWord;
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

// 선택된 텍스트의 정확한 위치를 찾는 함수
const findExactTextNode = (
  container: Node,
  text: string
): { node: Node; start: number; end: number } | null => {
  if (container.nodeType === Node.TEXT_NODE) {
    const content = container.textContent || "";
    const index = content.indexOf(text);
    if (index !== -1) {
      return { node: container, start: index, end: index + text.length };
    }
  } else if (container.nodeType === Node.ELEMENT_NODE) {
    for (let i = 0; i < container.childNodes.length; i++) {
      const result = findExactTextNode(container.childNodes[i], text);
      if (result) return result;
    }
  }
  return null;
};

export const useWordSelection = (engData: string, korData: string) => {
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        setSelectedText(selection.toString().trim());
      } else {
        setSelectedText("");
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const handleSelection = useCallback((): SelectionResult | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed)
      return null;

    const range = selection.getRangeAt(0);
    const word = selectedText;

    // 선택된 텍스트가 비어있거나 유효하지 않은 경우 처리
    if (!word || !isValidWord(word) || word.length === 0) {
      return null;
    }

    // 정확한 텍스트 노드와 위치 찾기
    const exactLocation = findExactTextNode(
      range.commonAncestorContainer,
      word
    );
    if (!exactLocation) return null;

    // 선택된 텍스트가 완전한 단어인지 확인
    if (
      !isCompleteWord(
        exactLocation.node.textContent || "",
        exactLocation.start,
        exactLocation.end
      )
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
