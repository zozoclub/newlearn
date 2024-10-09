import { highlightingWord, SearchResult } from "@services/newsService";
import { useQueryClient } from "@tanstack/react-query";
import { DetailNewsType } from "types/newsType";
import { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useRecoilState } from "recoil";
import userInfoState from "@store/userInfoState";

type SelectedType = {
  word: string;
  engSentence: string;
  korSentence: string;
};

type WordModalPropsType = {
  wordModalPosition: { x: number; y: number };
  wordModalRef: React.RefObject<HTMLDivElement>;
  selected: SelectedType;
  setSelected: React.Dispatch<React.SetStateAction<SelectedType>>;
  searchResult: [SearchResult[], string[], string[]];
  newsId: number;
  difficulty: number;
};

const WordModal: React.FC<WordModalPropsType> = ({
  wordModalPosition,
  wordModalRef,
  selected,
  searchResult,
  setSelected,
  newsId,
  difficulty,
}) => {
  const handlePlayAudio = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    url: string
  ) => {
    event.preventDefault(); // 링크 이동 막기
    const audio = new Audio(url); // Audio 객체 생성
    audio.play(); // 음성 파일 재생
  };
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isJustSaved, setIsJustSaved] = useState<boolean>(false); // 저장 애니메이션을 위한 추가 상태
  const [userInfoValue, setUserInfoState] = useRecoilState(userInfoState);
  const queryClient = useQueryClient();
  const engData: DetailNewsType | undefined = queryClient.getQueryData([
    "getEngNewsDetail",
    difficulty,
    newsId,
  ]);

  useEffect(() => {
    // 배열 내에 selected와 동일한 word와 sentence가 있는지 확인
    const isWordSaved: boolean = engData?.words.some(
      (data) =>
        data.word === selected.word && data.sentence === selected.engSentence
    )
      ? true
      : false;

    setIsSaved(isWordSaved);
  }, [selected.word, selected.engSentence, engData]);

  const handleSave = () => {
    highlightingWord(
      Number(newsId),
      difficulty,
      selected.word,
      searchResult[0]
        .slice(0, 5)
        .map((mean) => mean.text)
        .join("//"),
      selected.engSentence,
      selected.korSentence,
      searchResult[1][0],
      searchResult[1][1],
      searchResult[2][0],
      searchResult[2][1]
    ).then((deleted: boolean) => {
      if (deleted) {
        queryClient.setQueryData<DetailNewsType>(
          ["getEngNewsDetail", difficulty, newsId],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              words: oldData.words.filter((word) => {
                return word.word !== selected.word;
              }),
            };
          }
        );
        setUserInfoState({
          ...userInfoValue,
          savedWordCount: userInfoValue.savedWordCount - 1,
        });
      } else {
        queryClient.setQueryData<DetailNewsType>(
          ["getEngNewsDetail", difficulty, newsId],
          (oldData) => {
            if (!oldData) return oldData;
            console.log(selected.engSentence, selected.word);
            return {
              ...oldData,
              words: [
                ...oldData.words,
                { sentence: selected.engSentence, word: selected.word },
              ],
            };
          }
        );
        setUserInfoState({
          ...userInfoValue,
          savedWordCount: userInfoValue.savedWordCount + 1,
        });
      }

      console.log(engData);

      setIsJustSaved(true); // 저장됨 애니메이션 트리거
      setTimeout(() => setIsJustSaved(false), 2000); // 애니메이션 2초 후 원래 상태로 복귀
    });
  };

  return (
    <Container
      style={{
        top: wordModalPosition.y,
        left: wordModalPosition.x,
      }}
      ref={wordModalRef}
    >
      <Word>
        <div>{selected.word}</div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div
            onClick={() => setSelected({ ...selected, word: "" })}
            style={{ cursor: "pointer" }}
          >
            &times;
          </div>
        </div>
      </Word>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginBottom: "0.5rem",
        }}
      >
        {searchResult[2][0] && (
          <div
            style={{
              marginRight: "0.5rem",
              fontSize: "1rem",
              lineHeight: "1.5rem",
              whiteSpace: "nowrap",
            }}
          >
            미국 {searchResult[1][0]}{" "}
            <a
              href={searchResult[2][0]} // 음성 파일 링크
              onClick={(event) => handlePlayAudio(event, searchResult[2][0])}
              className="btn_voice"
            >
              듣기
            </a>
          </div>
        )}

        {searchResult[2][1] && (
          <div
            style={{
              fontSize: "1rem",
              lineHeight: "1.5rem",
              whiteSpace: "nowrap",
            }}
          >
            영국 {searchResult[1][1]}{" "}
            <a
              href={searchResult[2][1]} // 음성 파일 링크
              onClick={(event) => handlePlayAudio(event, searchResult[2][1])}
              className="btn_voice"
            >
              듣기
            </a>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          width: "100%",
        }}
      >
        <WordMeaning>
          {searchResult[0].slice(0, 5).map((mean, index) => (
            <div key={index}>
              {index + 1}. {mean.text}
            </div>
          ))}
        </WordMeaning>
        <SaveButton
          $isSaved={isSaved}
          $isJustSaved={isJustSaved}
          onClick={handleSave}
        >
          {isSaved ? "저장됨" : "저장하기"}
        </SaveButton>
      </div>
    </Container>
  );
};

export default WordModal;

// 저장됨 애니메이션
const fadeInOut = keyframes`
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;

const SaveButton = styled.div<{ $isSaved: boolean; $isJustSaved: boolean }>`
  align-self: flex-end;
  min-width: 5rem;
  height: 2rem;
  font-size: 1rem;
  text-align: center;
  line-height: 2rem;
  cursor: pointer;
  background-color: ${(props) => (props.$isSaved ? "#4caf50" : "#f0f0f0")};
  color: ${(props) => (props.$isSaved ? "white" : "black")};
  border-radius: 0.5rem;
  transition: background-color 0.3s ease, color 0.3s ease;

  ${(props) =>
    props.$isJustSaved &&
    css`
      animation: ${fadeInOut} 2s ease;
    `}
`;

const Container = styled.div`
  position: absolute;
  z-index: 1;
  min-width: 10rem;
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 1.5rem;
  border-radius: 0.75rem;
`;

const Word = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const WordMeaning = styled.div`
  min-width: 12rem;
  font-size: 1rem;
`;
