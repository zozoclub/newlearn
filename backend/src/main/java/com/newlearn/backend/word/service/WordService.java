package com.newlearn.backend.word.service;

import java.util.List;

import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.word.dto.request.WordRequestDto;
import com.newlearn.backend.word.dto.response.WordResponseDTO;

public interface WordService {

	void addWord(WordRequestDto wordRequestDto, Users user);

	List<WordResponseDTO> getWords(Users user);
}
