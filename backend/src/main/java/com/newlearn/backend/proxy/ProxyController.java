package com.newlearn.backend.proxy;

import java.net.URLDecoder;

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
			System.out.println(word);
			String url = "https://dic.daum.net/search.do?q=" + word;
			String result = restTemplate.getForObject(url, String.class);
			result = result.replace("\t", "");
			result = result.replace("\n", "");
			result = result.replace("\"", "");
			System.out.println(result);
			return ApiResponse.createSuccess(result, "성공적 조회");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.WORD_CREATE_FAILED);
		}

	}
}
