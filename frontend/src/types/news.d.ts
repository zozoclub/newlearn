export type NewsDetailContentType = {
  engIsLoading: boolean;
  korIsLoading: boolean;
  selectedKorContent: string;
  engData: DetailNewsType | undefined;
  korData: DetailNewsType | undefined;
  newsId: number;
  difficulty: number;
};
