package com.newlearn.backend.word.service;

import java.time.LocalDateTime;
import java.util.List;

import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.word.dto.request.CompleteRequestDTO;
import com.newlearn.backend.word.dto.request.DeleteRequestDTO;
import com.newlearn.backend.word.dto.request.RestudyResultRequestDTO;
import com.newlearn.backend.word.dto.request.WordRequestDto;
import com.newlearn.backend.word.dto.response.RestudyWordResponseDTO;
import com.newlearn.backend.word.dto.response.WordAddResponseDTO;
import com.newlearn.backend.word.dto.response.WordDetailResponseDTO;
import com.newlearn.backend.word.dto.response.WordResponseDTO;
import com.newlearn.backend.word.model.Word;

public interface WordService {

	WordAddResponseDTO addWord(WordRequestDto wordRequestDto, Users user) throws Exception;

	List<WordResponseDTO> getWords(Users user);

	List<WordResponseDTO> getCompleteWords(Users user);

	void deleteWord(DeleteRequestDTO dto);

	WordDetailResponseDTO getWordDetail(String word, Users user) throws Exception;

	void completeWord(CompleteRequestDTO dto, Users user);

	List<RestudyWordResponseDTO> getWordsForRestudy(Users user);

	void processRestudy(Long wordId, boolean remembered);

	void skipRestudy(Long wordId);

	void finalCompleteRestudy(Long wordId);

	void exitAndSaveResult(List<RestudyResultRequestDTO> results);
}
