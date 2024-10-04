import React, { useRef, useState } from "react";
import styled from "styled-components";
import searchIcon from "@assets/icons/searchIcon.svg";
import { searchNews } from "@services/newsService";
import { usePageTransition } from "@hooks/usePageTransition";

type SearchNews = {
  newsId: number;
  title: string;
  titleEng: string;
};

const NewsSearch: React.FC = () => {
  const transitionTo = usePageTransition();

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchNews[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [clickedNewsId, setClickedNewsId] = useState<number | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchValue(query);

    if (query && !isMixedLanguage(query)) {
      try {
        const results = await searchNews(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

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
  const isKorean = (text: string) => /^[가-힣\s]*$/.test(text);
  const isMixedLanguage = (text: string) => !isEnglish(text) && !isKorean(text);

  const getAppropriateTitle = (result: SearchNews, searchTerm: string) => {
    return isEnglish(searchTerm) ? result.titleEng : result.title;
  };

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

  return (
    <SearchContainer>
      <img src={searchIcon} alt="Search Icon" />
      <input
        placeholder="뉴스를 검색해 보세요."
        value={searchValue}
        onChange={handleInputChange}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => {
          // Delay hiding results to allow click to register
          setTimeout(() => setIsInputFocused(false), 200);
        }}
      />
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
    margin-right: 0.5rem;
    width: 2rem;
    height: 2rem;
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
    color: ${(props) => props.theme.colors.placeholder};
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
  border-radius: 4px;
  z-index: 100;
  overflow-y: auto;
`;

const ResultItem = styled.div`
  padding: 1.5rem;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 1.25rem;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.readonly};
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.colors.text03};
  }
`;

const HighlightedText = styled.span`
  font-weight: bold;
  color: ${(props) => props.theme.colors.highliting};
`;

export default NewsSearch;
