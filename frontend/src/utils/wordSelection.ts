import { useCallback } from "react";
import { searchDaumDictionary } from "@services/newsService"; // 이전에 정의한 함수를 import

type SelectionResult = {
  word: string;
  sentence: string;
};

const isCompleteWord = (node: Node, range: Range): boolean => {
  const nodeText = node.textContent || "";
  const selectionStart = range.startOffset;
  const selectionEnd = range.endOffset;

  // 선택 시작 부분 확인
  const beforeChar = nodeText[selectionStart - 1];
  const isStartOfWord = !beforeChar || /\W/.test(beforeChar);

  // 선택 끝 부분 확인
  const afterChar = nodeText[selectionEnd];
  const isEndOfWord = !afterChar || /\W/.test(afterChar);

  return isStartOfWord && isEndOfWord;
};

const isValidWord = (word: string): boolean => {
  // 공백이나 특수문자가 포함되지 않은 경우만 유효한 단어로 간주
  return /^[a-zA-Z가-힣]+$/.test(word);
};

const extractSentence = (node: Node, word: string): string | null => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || "";
    const sentenceRegex = new RegExp(`[^.!?]*\\b${word}\\b[^.!?]*[.!?]`);
    const match = text.match(sentenceRegex);
    return match ? match[0].trim() : null;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    for (let i = 0; i < node.childNodes.length; i++) {
      const sentence = extractSentence(node.childNodes[i], word);
      if (sentence) return sentence;
    }
  }

  return null;
};

export const useWordSelection = () => {
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

    const startNode = range.startContainer;

    // 선택된 단어를 포함하는 문장 추출
    let currentNode: Node | null = startNode;
    let sentence: string | null = null;
    while (currentNode && !sentence) {
      sentence = extractSentence(currentNode, word);
      currentNode = currentNode.parentNode;
    }

    if (sentence) {
      const result: SelectionResult = { word, sentence };
      console.log(result);
      searchDaumDictionary(word)
        .then((searchResult) => {
          console.log("Daum Dictionary Result:", searchResult);
        })
        .catch((error) => {
          console.error("Error searching Daum Dictionary:", error);
        });
      return result;
    }

    return null;
  }, []);

  return { handleSelectionChange };
};
