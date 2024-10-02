package com.newlearn.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.elasticsearch.repository.config.EnableReactiveElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableJpaRepositories(basePackages = {
	"com.newlearn.backend.news.repository",
	"com.newlearn.backend.rank.repository",
	"com.newlearn.backend.study.repository",
	"com.newlearn.backend.user.repository",
	"com.newlearn.backend.word.repository"
})
@EnableElasticsearchRepositories( basePackages = "com.newlearn.backend.search.repository")
@EnableRedisRepositories(basePackages = {"com.newlearn.backend.oauth.repository", "com.newlearn.backend.user.repository.redis"})
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
