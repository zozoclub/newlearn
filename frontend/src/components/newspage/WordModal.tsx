import { highlightingWord, SearchResult } from "@services/newsService";
import styled from "styled-components";

const WordModal: React.FC<{
  wordModalPosition: { x: number; y: number };
  wordModalRef: React.RefObject<HTMLDivElement>;
  selected: {
    word: string;
    engSentence: string;
    korSentence: string;
  };
  setSelected: React.Dispatch<
    React.SetStateAction<{
      word: string;
      engSentence: string;
      korSentence: string;
    }>
  >;
  searchResult: [SearchResult[], string[], string[]];
  newsId: number;
  difficulty: number;
}> = ({
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
          {searchResult[2][0] && (
            <div style={{ fontSize: "1rem", lineHeight: "2rem" }}>
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
            <div style={{ fontSize: "1rem", lineHeight: "2rem" }}>
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

          <div
            onClick={() => setSelected({ ...selected, word: "" })}
            style={{ cursor: "pointer" }}
          >
            &times;
          </div>
        </div>
      </Word>
      <WordMeaning>
        {searchResult[0].slice(0, 5).map((mean, index) => (
          <div key={index}>
            {index + 1}. {mean.text}
          </div>
        ))}
      </WordMeaning>
      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          right: "1.5rem",
          fontSize: "1rem",
        }}
        onClick={() =>
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
          )
        }
      >
        저장하기
      </div>
    </Container>
  );
};

export default WordModal;

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
  font-size: 1rem;
`;
