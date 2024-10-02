import styled from "styled-components";
import LoadingDiv from "./LoadingDiv";
import LoadingBar from "./LoadingBar";
import { useWordSelection } from "@utils/wordSelection";
import {
  DetailNewsType,
  searchDaumDictionary,
  SearchResult,
} from "@services/newsService";
import { useRecoilValue } from "recoil";
import languageState from "@store/languageState";
import WordModal from "./WordModal";
import { useEffect, useRef, useState } from "react";

const NewsDetailContent: React.FC<{
  engIsLoading: boolean;
  korIsLoading: boolean;
  selectedKorContent: string;
  engData: DetailNewsType | undefined;
  korData: DetailNewsType | undefined;
  newsId: number;
  difficulty: number;
}> = ({
  engIsLoading,
  korIsLoading,
  selectedKorContent,
  engData,
  korData,
  newsId,
  difficulty,
}) => {
  const { handleSelectionChange } = useWordSelection(selectedKorContent);
  const languageData = useRecoilValue(languageState);
  const [searchResult, setSearchResult] =
    useState<[SearchResult[], string[], string[]]>();
  const [wordModalPosition, setWordModalPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [selected, setSelected] = useState<{
    word: string;
    engSentence: string;
    korSentence: string;
  }>({ word: "", engSentence: "", korSentence: "" });

  const wordModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wordModalRef.current &&
        !wordModalRef.current.contains(event.target as Node)
      ) {
        setSelected({ ...selected, word: "" });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      {engIsLoading || korIsLoading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <LoadingDiv>
            <LoadingBar />
          </LoadingDiv>
          <LoadingDiv>
            <LoadingBar />
          </LoadingDiv>
          <LoadingDiv>
            <LoadingBar />
          </LoadingDiv>
        </div>
      ) : (
        <div
          onMouseUp={(event) => {
            const result = handleSelectionChange();
            if (result) {
              const prevWord = result.word;
              // 선택된 단어에 대한 추가 정보를 외부 사전에서 조회
              searchDaumDictionary(result.word)
                .then((searchResult) => {
                  console.log("Daum Dictionary Result:", searchResult);
                  setSearchResult(searchResult);

                  setSelected({
                    word: result.word,
                    engSentence: result.englishSentence,
                    korSentence: result.koreanSentence,
                  });
                  if (prevWord !== selected.word) {
                    setWordModalPosition({
                      x: event.pageX,
                      y: event.pageY - 200,
                    });
                  }
                })
                .catch((error) => {
                  console.error("Error searching Daum Dictionary:", error);
                });
            }
          }}
        >
          {languageData === "en" ? engData?.content : korData?.content}
          {searchResult && selected.word && (
            <WordModal
              difficulty={difficulty}
              newsId={Number(newsId)}
              searchResult={searchResult}
              selected={selected}
              setSelected={setSelected}
              wordModalPosition={wordModalPosition}
              wordModalRef={wordModalRef}
            />
          )}
        </div>
      )}
    </Container>
  );
};

export default NewsDetailContent;

const Container = styled.div`
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin: 1.5rem 0;
`;
