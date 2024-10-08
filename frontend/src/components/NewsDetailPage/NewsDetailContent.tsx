import styled from "styled-components";
import LoadingDiv from "@components/common/LoadingDiv";
import LoadingBar from "@components/common/LoadingBar";
import { useWordSelection } from "@utils/wordSelection";
import { searchDaumDictionary, SearchResult } from "@services/newsService";
import { useRecoilValue } from "recoil";
import languageState from "@store/languageState";
import WordModal from "./WordModal";
import { useEffect, useRef, useState } from "react";
import { DetailNewsType } from "types/newsType";

type NewsDetailContentType = {
  engIsLoading: boolean;
  korIsLoading: boolean;
  engData: DetailNewsType | undefined;
  korData: DetailNewsType | undefined;
  newsId: number;
  difficulty: number;
};

type PositionType = {
  x: number;
  y: number;
};

type SelectedType = {
  word: string;
  engSentence: string;
  korSentence: string;
};

const NewsDetailContent: React.FC<NewsDetailContentType> = ({
  engIsLoading,
  korIsLoading,
  engData,
  korData,
  newsId,
  difficulty,
}) => {
  const [engContent, setEngContent] = useState<string>("");
  const [korContent, setKorContent] = useState<string>("");
  const { handleSelection } = useWordSelection(engContent, korContent);
  const languageData = useRecoilValue(languageState);
  const [searchResult, setSearchResult] =
    useState<[SearchResult[], string[], string[]]>();
  const [wordModalPosition, setWordModalPosition] = useState<PositionType>({
    x: 0,
    y: 0,
  });
  const [selected, setSelected] = useState<SelectedType>({
    word: "",
    engSentence: "",
    korSentence: "",
  });
  const wordModalRef = useRef<HTMLDivElement>(null);
  const [slicedContent, setSlicedContent] = useState<
    { sentence: string; words: string[] }[]
  >([]);

  const handleSelectionEnd = (event: React.TouchEvent | React.MouseEvent) => {
    const result = handleSelection();
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
            let x: number, y: number;

            if ("touches" in event) {
              // Touch event
              const touch = event.changedTouches[0];
              x = touch.clientX;
              y = touch.clientY;
            } else {
              // Mouse event
              x = (event as React.MouseEvent).clientX;
              y = (event as React.MouseEvent).clientY;
            }

            setWordModalPosition({
              x: window.innerWidth - x < 200 ? window.screenLeft + 200 : x,
              y: y + 200,
            });
          }
        })
        .catch((error) => {
          console.error("Error searching Daum Dictionary:", error);
        });
    }
  };

  useEffect(() => {
    if (engData) {
      setEngContent(engData.content!);
    }
  }, [engData]);

  useEffect(() => {
    if (korData) {
      setKorContent(korData.content!);
    }
  }, [korData]);

  // wordModal 외의 영역을 클릭했을 때 modal이 닫히는 event 추가
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

  // 영어 Content를 단어 별로 찢음
  useEffect(() => {
    if (engData) {
      const slice: { sentence: string; words: string[] }[] = [];
      const engSentences = engData.content!.match(/[^.]*[.]/g);
      engSentences?.forEach((sentence) => {
        const words = sentence.split(" ");
        slice.push({ sentence, words });
      });
      setSlicedContent(slice);
    }
  }, [engData]);

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
          style={{
            display: "flex",
            gap: "0.25rem",
            maxWidth: "100%",
            flexWrap: "wrap",
          }}
          onMouseUp={handleSelectionEnd}
          onTouchEnd={handleSelectionEnd}
        >
          {languageData === "en"
            ? slicedContent.map((slice) =>
                slice.words.map((word, index) => (
                  <div
                    key={index}
                    style={{
                      color: `${
                        engData?.words.some((engWord) => {
                          const cleanWord = word.replace(
                            /^[^\w]+|[^\w]+$/g,
                            ""
                          );
                          return (
                            engWord.word.toLowerCase() ===
                            cleanWord.toLowerCase()
                          );
                        })
                          ? "red"
                          : ""
                      }`,
                    }}
                  >
                    {word}
                  </div>
                ))
              )
            : korData?.content}
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
