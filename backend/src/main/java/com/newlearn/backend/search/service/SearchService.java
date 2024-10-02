package com.newlearn.backend.search.service;

import com.newlearn.backend.search.dto.response.SearchNewsDTO;
import com.newlearn.backend.search.model.SearchNews;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

	private final ElasticsearchClient elasticsearchClient;

	public List<SearchNewsDTO> searchByTitleOrTitleEng(String query) throws IOException {
		if (isKorean(query) && isEnglish(query)) {
			return null;
		}

		String analyzer = isKorean(query) ? "title" : "title_eng";

		SearchRequest searchRequest = SearchRequest.of(s -> s
			.index("news")
			.query(q -> q
				.multiMatch(m -> m
					.query(query)
					.fields(List.of(analyzer))
				)
			)
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

	private SearchNewsDTO toSearchNewsDTO(SearchNews news) {
		String cleanTitle = news.getTitle() != null ? news.getTitle().replaceAll("\"", "") : null;
		String cleanTitleEng = news.getTitleEng() != null ? news.getTitleEng().replaceAll("\"", "") : null;
		return new SearchNewsDTO(news.getNewsId(), cleanTitle, cleanTitleEng);
	}

}
