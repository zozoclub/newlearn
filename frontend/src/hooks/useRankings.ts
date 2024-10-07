import {
  PointRankingType,
  ReadRankingType,
} from "@components/mainpage/RankingWidget";
import {
  getPointRankingList,
  getReadRankingList,
} from "@services/rankingService";
import { useQueries, UseQueryResult } from "@tanstack/react-query";

export function useRankings() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["pointRankingList"],
        queryFn: getPointRankingList,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ["readRankingList"],
        queryFn: getReadRankingList,
        staleTime: 5 * 60 * 1000,
      },
    ],
  }) as [
    UseQueryResult<PointRankingType[], Error>,
    UseQueryResult<ReadRankingType[], Error>
  ];

  const isLoading = results.some((result) => result.isLoading);
  const [pointRankingList, readRankingList] = results.map(
    (result) => result.data
  );

  return { isLoading, pointRankingList, readRankingList };
}
