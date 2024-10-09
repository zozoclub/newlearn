import styled, { useTheme } from "styled-components";
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
  const theme = useTheme();

  const contentRef = useRef<HTMLDivElement>(null);

  const getSelectionPosition = (): { x: number; y: number } | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (!contentRef.current) return null;

    const containerRect = contentRef.current.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + contentRef.current.scrollLeft,
      y: rect.top - containerRect.top + contentRef.current.scrollTop,
    };
  };

  const handleSelectionEnd = () => {
    const result = handleSelection();
    if (result) {
      const prevWord = result.word;
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
            const position = getSelectionPosition();
            if (position) {
              const modalWidth = 300; // 모달의 예상 너비

              let x = position.x;
              const y = position.y + 30;

              // 컨테이너의 오른쪽 경계를 넘어가지 않도록 조정
              if (x + modalWidth > (contentRef.current?.offsetWidth || 0)) {
                x = (contentRef.current?.offsetWidth || 0) - modalWidth;
              }

              setWordModalPosition({ x, y });
            }
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
          <LoadingBar />
          <LoadingBar />
          <LoadingBar />
        </div>
      ) : (
        <NewsContentDiv
          ref={contentRef}
          style={{
            cursor: `url(/src/assets/icons/highlighter.svg) -30 30, auto`,
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
                      backgroundColor: `${
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
                          ? `${theme.mode === "dark" ? "#aaaa00" : "#ffff008b"}`
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
        </NewsContentDiv>
      )}
    </Container>
  );
};

export default NewsDetailContent;

const Container = styled.div`
  font-size: 1.25rem;
  line-height: 1.75rem;
  margin: 1.5rem 0;
  @media (max-width: 767px) {
    font-size: 1.1rem;
    line-height: 1.5rem;
  }
`;

const NewsContentDiv = styled.div`
  display: flex;
  gap: 0.25rem;
  max-width: 100%;
  flex-wrap: wrap;
  position: relative;
  ::selection {
    background-color: #ffff008b;
  }
`;
