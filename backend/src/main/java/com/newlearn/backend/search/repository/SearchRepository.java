package com.newlearn.backend.search.repository;

import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.newlearn.backend.search.model.SearchNews;

@Repository
public interface SearchRepository extends ElasticsearchRepository<SearchNews, Long> {
	// 제목으로 뉴스 검색 (커스텀 쿼리)

}
