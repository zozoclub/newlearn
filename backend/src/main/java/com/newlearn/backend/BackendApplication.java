package com.newlearn.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableScheduling
@EnableJpaRepositories(basePackages = {
	"com.newlearn.backend.news.repository",
	"com.newlearn.backend.rank.repository",
	"com.newlearn.backend.study.repository",
	"com.newlearn.backend.user.repository",
	"com.newlearn.backend.word.repository"
})
@EnableRedisRepositories(basePackages = {"com.newlearn.backend.oauth.repository", "com.newlearn.backend.user.repository.redis"})
@EnableMongoRepositories(basePackages = "com.newlearn.backend.news.repository.mongo")
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}
