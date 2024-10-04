package com.newlearn.backend.search.service;

import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.model.UserNewsRead;
import com.newlearn.backend.news.repository.NewsRepository;
import com.newlearn.backend.news.repository.UserNewsReadRepository;
import com.newlearn.backend.search.dto.response.SearchNewsAutoDTO;
import com.newlearn.backend.search.dto.response.SearchNewsDTO;
import com.newlearn.backend.search.model.SearchNews;
import com.newlearn.backend.user.model.Users;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.indices.RefreshRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

	private final ElasticsearchClient elasticsearchClient;
	private final NewsRepository newsRepository;
	private final UserNewsReadRepository readRepository;

	public List<SearchNewsDTO> searchByTitleOrTitleEng(String query, Users user) throws IOException {
		if (isKorean(query) && isEnglish(query)) {
			return null;
		}
		elasticsearchClient.indices().refresh(RefreshRequest.of(r -> r.index("news")));

		String analyzer = isKorean(query) ? "title" : "title_eng";

		SearchRequest searchRequest = SearchRequest.of(s -> s
			.index("news")
			.size(200)
			.query(q -> q
				.multiMatch(m -> m
					.query(query)
					.fields(List.of(analyzer))
				)
			)
		);

		SearchResponse<SearchNews> response = elasticsearchClient.search(searchRequest, SearchNews.class);

		List<Long> newsIds = response.hits().hits().stream()
			.map(Hit::source)
			.map(SearchNews::getNewsId)
			.collect(Collectors.toList());

		List<News> newsList = newsRepository.findAllById(newsIds);

		List<UserNewsRead> userNewsReads = readRepository.findAllByUserAndNewsIn(user, newsList);

		Map<Long, UserNewsRead> userNewsReadMap = userNewsReads.stream()
			.collect(Collectors.toMap(read -> read.getNews().getNewsId(), read -> read));

		return newsList.stream()
			.map(news -> buildSearchNewsDTO(user, news, userNewsReadMap.get(news.getNewsId())))
			.collect(Collectors.toList());
	}

	private SearchNewsDTO buildSearchNewsDTO(Users user, News news, UserNewsRead userNewsRead) {
		List<Boolean> isReadList = (userNewsRead != null)
			? Arrays.asList(userNewsRead.getReadStatus()[0], userNewsRead.getReadStatus()[1], userNewsRead.getReadStatus()[2])
			: Arrays.asList(false, false, false);

		return new SearchNewsDTO(
			news.getNewsId(),
			news.getTitle(),
			news.getContent(),
			news.getThumbnailImageUrl(),
			news.getCategory().getCategoryName(),
			news.getPublishedDate(),
			isReadList
		);
	}


	public List<SearchNewsAutoDTO> searchAutoCompleteByTitleOrTitleEng(String query) throws IOException {
		System.out.println(query);
		if (isKorean(query) && isEnglish(query)) {
			return null;
		}
		String analyzer = isKorean(query) ? "title" : "title_eng";
		elasticsearchClient.indices().refresh(RefreshRequest.of(r -> r.index("news")));


		SearchRequest searchRequest = SearchRequest.of(s -> s
			.index("news")
			.query(q -> q
				.bool(b -> b
					.should(sh -> sh
						.match(m -> m
							.field(analyzer)
							.query(query)
							.boost(2.0f)
						)
					)
					.should(sh -> sh
						.matchPhrasePrefix(m -> m
							.field(analyzer)
							.query(query)
							.boost(1.0f)
						)
					)
				)
			)
			.size(10)  // 결과 10개로 제한
			.requestCache(false)
		);

		SearchResponse<SearchNews> response = elasticsearchClient.search(searchRequest, SearchNews.class);

		return response.hits().hits().stream()
			.map(Hit::source)
			.map(this::toSearchNewsDTO)
			.collect(Collectors.toList());
	}

		private boolean isKorean(String text) {
		return text.matches(".*[ㄱ-ㅎㅏ-ㅣ가-힣]+.*");
	}

	private boolean isEnglish(String text) {
		return text.matches(".*[a-zA-Z]+.*");
	}

	private SearchNewsAutoDTO toSearchNewsDTO(SearchNews news) {
		String cleanTitle = news.getTitle() != null ? news.getTitle().replaceAll("\"", "") : null;
		String cleanTitleEng = news.getTitleEng() != null ? news.getTitleEng().replaceAll("\"", "") : null;
		return new SearchNewsAutoDTO(news.getNewsId(), cleanTitle, cleanTitleEng);
	}

}
