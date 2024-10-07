import React, { useMemo } from "react";
import TagCloud from "react-tag-cloud";
import { useQuery } from "@tanstack/react-query";
import { getWordCloud } from "@services/searchService";

interface WordCloudItem {
  keyword: string;
  count: number;
}

// 미리 정의된 색상 팔레트
const colorPalette = [
  "#4b6b8b", // 진한 청회색
  "#46607a", // 매우 진한 청회색
  "#95a5a6", // 밝은 회색
  "#7f8c8d", // 진한 회색
  "#3498db", // 부드러운 파랑
  "#2980b9", // 진한 파랑
  "#1abc9c", // 청록색
  "#16a085", // 진한 청록색
  "#27ae60", // 부드러운 녹색
  "#2e70cc", // 밝은 녹색
  "#0f78f1", // 부드러운 노랑
  "#129df3", // 부드러운 주황
];

const WordCloud: React.FC = () => {
  const { data, isLoading, error } = useQuery<WordCloudItem[]>({
    queryKey: ["wordCloud"],
    queryFn: getWordCloud,
  });

  const sortedData = useMemo(() => {
    return data?.sort((a, b) => b.count - a.count) || [];
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  const cloudStyle = {
    fontSize: 40,
    fontStyle: "normal" as const,
    width: "100%",
    height: "100%",
  };

  return (
    <div style={{ width: "1100px", height: "600px" }}>
      <TagCloud style={cloudStyle}>
        {sortedData.map((item, index) => (
          <div
            key={item.keyword}
            style={{
              fontSize: item.count * 3.3,
              fontFamily: "Righteous",
              fontWeight: "400",
              color: colorPalette[index % colorPalette.length],
              display: "inline-block",
            }}
          >
            {item.keyword}
          </div>
        ))}
      </TagCloud>
    </div>
  );
};

export default WordCloud;
