package com.newlearn.backend.search.service;

import com.newlearn.backend.news.dto.response.NewsResponseDTO;
import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.model.UserNewsRead;
import com.newlearn.backend.news.repository.NewsRepository;
import com.newlearn.backend.news.repository.UserNewsReadRepository;
import com.newlearn.backend.search.dto.request.SearchListRequestDTO;
import com.newlearn.backend.search.dto.response.SearchNewsAutoDTO;
import com.newlearn.backend.search.dto.response.SearchNewsDTO;
import com.newlearn.backend.search.model.SearchNews;
import com.newlearn.backend.user.model.Users;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.DeleteByQueryRequest;
import co.elastic.clients.elasticsearch.core.DeleteByQueryResponse;
import co.elastic.clients.elasticsearch.indices.RefreshRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

	private final ElasticsearchClient elasticsearchClient;
	private final NewsRepository newsRepository;
	private final UserNewsReadRepository readRepository;

	public Page<NewsResponseDTO> searchByTitleOrTitleEng(SearchListRequestDTO searchListRequestDTO, Users user) throws IOException {
		String query = searchListRequestDTO.getQuery();
		if (isKorean(query) && isEnglish(query)) {
			return null;
		}
		elasticsearchClient.indices().refresh(RefreshRequest.of(r -> r.index("news")));

		String analyzer = isKorean(query) ? "title" : "title_eng";
		searchListRequestDTO.setLang(isKorean(query) ? "kr" : "en");
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

		// 검색 결과에서 newsId 리스트 추출
		List<Long> newsIds = response.hits().hits().stream()
			.map(Hit::source)
			.map(SearchNews::getNewsId)
			.collect(Collectors.toList());

		// 검색 결과가 없을 때 빈 페이지 반환
		if (newsIds.isEmpty()) {
			return new PageImpl<>(Collections.emptyList(), searchListRequestDTO.getPageable(), 0);
		}

		// 필터링된 뉴스 데이터에 페이지네이션 적용하여 가져오기
		Page<News> newsList = newsRepository.findByNewsIdInOrderByNewsIdDesc(newsIds, searchListRequestDTO.getPageable());

		// 사용자가 읽은 뉴스 데이터를 newsIds를 기준으로 한 번에 조회하여 매핑
		List<UserNewsRead> userNewsReads = readRepository.findAllByUserAndNews_NewsIdIn(user, newsIds);
		Map<Long, UserNewsRead> userNewsReadMap = userNewsReads.stream()
			.collect(Collectors.toMap(unr -> unr.getNews().getNewsId(), Function.identity()));

		// 결과를 DTO로 변환하여 반환
		return newsList.map(news -> NewsResponseDTO.makeNewsResponseDTO(
			news,
			searchListRequestDTO.getLang(),
			searchListRequestDTO.getDifficulty(),
			userNewsReadMap.get(news.getNewsId()) // 사용자가 읽은 정보와 함께 반환
		));
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

	public void deleteAggregateIndex() throws IOException {

		DeleteByQueryRequest deleteRequest = DeleteByQueryRequest.of(d -> d
			.index("news_aggregation")
			.query(q -> q
				.matchAll(m -> m)
			)
		);

		DeleteByQueryResponse deleteResponse = elasticsearchClient.deleteByQuery(deleteRequest);

		if (deleteResponse.deleted() <= 0) {
			System.out.println("삭제할 문서 없음");
		}

	}
}
