import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import searchIcon from "@assets/icons/searchIcon.svg";
import { searchAutoNews } from "@services/searchService";
import { usePageTransition } from "@hooks/usePageTransition";

type SearchAutoNews = {
  newsId: number;
  title: string;
  titleEng: string;
};

type NewsSearchProps = {
  initialQuery?: string;
};

const NewsSearch: React.FC<NewsSearchProps> = ({ initialQuery = "" }) => {
  const transitionTo = usePageTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchAutoNews[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [clickedNewsId, setClickedNewsId] = useState<number | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 검색 페이지에서 검색 창에 검색어 나타나게 함
  useEffect(() => {
    if (initialQuery) {
      handleInputChange({
        target: { value: initialQuery },
      } as React.ChangeEvent<HTMLInputElement>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // input change를 감지해 api 호출
  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchValue(query);

    // 한글 또는 영어가 포함된 경우 요청을 보냄
    if (query && !isMixedLanguage(query)) {
      try {
        const results = await searchAutoNews(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    } else {
      // 입력 값이 없을 경우 검색 결과를 비워줌
      setSearchResults([]);
    }
  };

  // 검색 결과 창 클릭 시 focus out 대신 디테일 페이지로 클릭 가능하도록 함
  const handleResultMouseDown = (newsId: number) => {
    setClickedNewsId(newsId);
  };

  const handleResultClick = (newsId: number) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      if (newsId === clickedNewsId) {
        transitionTo(`/news/detail/${newsId}`);
        setSearchValue("");
        setSearchResults([]);
        setClickedNewsId(null);
      }
    }, 50);
  };

  const isEnglish = (text: string) => /^[A-Za-z\s]*$/.test(text);
  const isKorean = (text: string) => /^[가-힣ㄱ-ㅎㅏ-ㅣ\s]*$/.test(text);
  const isMixedLanguage = (text: string) => !isEnglish(text) && !isKorean(text);

  const getAppropriateTitle = (result: SearchAutoNews, searchTerm: string) => {
    return isEnglish(searchTerm) ? result.titleEng : result.title;
  };

  // 검색어 하이라이팅
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <HighlightedText key={index}>{part}</HighlightedText>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // 검색 버튼 눌렀을 때 검색 페이지로 이동
  const executeSearch = () => {
    if (searchValue.trim()) {
      const encodedQuery = encodeURIComponent(searchValue.trim());
      transitionTo(`/news/search/${encodedQuery}`);
      inputRef.current?.blur();
    }
  };

  const handleSearchIconClick = () => {
    executeSearch();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      executeSearch();
    }
  };
  return (
    <SearchContainer>
      <input
        ref={inputRef}
        placeholder="검색어를 입력해 주세요."
        value={searchValue}
        onChange={handleInputChange}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => {
          // Delay hiding results to allow click to register
          setTimeout(() => setIsInputFocused(false), 200);
        }}
        onKeyDown={handleKeyDown}
      />
      <img src={searchIcon} alt="Search Icon" onClick={handleSearchIconClick} />

      {isInputFocused && searchResults.length > 0 && (
        <ResultsContainer>
          {searchResults.map((result) => (
            <ResultItem
              key={result.newsId}
              onMouseDown={() => handleResultMouseDown(result.newsId)}
              onClick={() => handleResultClick(result.newsId)}
            >
              {highlightSearchTerm(
                getAppropriateTitle(result, searchValue),
                searchValue
              )}
            </ResultItem>
          ))}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  position: relative;

  img {
    margin-left: 0.5rem;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }

  input {
    width: 100%;
    height: 40px;
    padding: 0.5rem 1rem;
    background-color: transparent;
    color: ${(props) => props.theme.colors.text};
    border: none;
    border-bottom: 2px solid ${(props) => props.theme.colors.text04};
    border-radius: 4px 4px 0 0;
    outline: none;
    font-size: 1.25rem;
  }

  input::placeholder {
    font-weight: 200;
    color: ${(props) => props.theme.colors.text04};
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: calc(100%);
  left: 0;
  right: 0;
  max-height: 400px;
  background-color: ${(props) => props.theme.colors.cardBackground};
  border: 1px solid ${(props) => props.theme.colors.text03};
  border-radius: 8px;
  z-index: 100;
  overflow-y: auto;
`;

const ResultItem = styled.div`
  padding: 1.5rem;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.readonly};
  }
`;

const HighlightedText = styled.span`
  font-weight: bold;
  color: ${(props) => props.theme.colors.highliting};
`;

export default NewsSearch;
