package com.newlearn.backend.search.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class ElasticsearchConfig {

	@Value("${elastic.host}")
    private String host;

	@Value("${elastic.port}")
    private String port;

	@Bean
	public RestClient restClient() {
		return RestClient.builder(
			new HttpHost(host, port, "http")
		).build();
	}

	@Bean
	public ElasticsearchTransport elasticsearchTransport(RestClient restClient) {
		return new RestClientTransport(
			restClient,
			new JacksonJsonpMapper()
		);
	}

	@Bean
	public ElasticsearchClient elasticsearchClient(ElasticsearchTransport transport) {
		return new ElasticsearchClient(transport);
	}
}
