package com.newlearn.backend.proxy;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.newlearn.backend.common.ApiResponse;
import com.newlearn.backend.common.ErrorCode;

@RestController("/api/proxy")
public class ProxyController {

	private final RestTemplate restTemplate;

	public ProxyController() {
		this.restTemplate = new RestTemplate();
	}

	@GetMapping("/api/proxy")
	public ApiResponse<?> getWordData(@RequestParam String word) {

		try {
			String url = "https://dic.daum.net/search.do?q=" + word;
			String result = restTemplate.getForObject(url, String.class);
			return ApiResponse.createSuccess(result, "성공적 조회");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.WORD_CREATE_FAILED);
		}

	}
}
