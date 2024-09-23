package com.newlearn.backend.word.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.word.dto.request.WordRequestDto;
import com.newlearn.backend.word.dto.response.WordResponseDTO;
import com.newlearn.backend.word.model.Word;
import com.newlearn.backend.word.model.WordSentence;
import com.newlearn.backend.word.repository.WordRepository;
import com.newlearn.backend.word.repository.WordSentenceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class WordServiceImpl implements WordService {

	private final WordRepository wordRepository;
	private final WordSentenceRepository wordSentenceRepository;

	@Transactional
	@Override
	public void addWord(WordRequestDto wordRequestDto, Users user) {

		Word addWord = wordRequestDto.toWordEntity(user);
		Word savedWord = wordRepository.save(addWord);

		// 양방향 연관 관계 설정을 위해 Users에도 단어 추가
		user.addWord(savedWord);

		WordSentence addWordSentence = wordRequestDto.toSentenceEntity(savedWord);
		wordSentenceRepository.save(addWordSentence);
	}

	@Override
	public List<WordResponseDTO> getWords(Users user) {

		List<Word> findAllWords = wordRepository.findAllByUser(user);

		List<WordResponseDTO> response = new ArrayList<>();

		for(final Word word : findAllWords) {
			WordResponseDTO wordResponseDTO = new WordResponseDTO(word.getWordId(), word.getWord(),
				word.getWordMeaning(), word.isComplete());
			response.add(wordResponseDTO);
		}

		return response;
	}

	@Override
	public List<WordResponseDTO> getCompleteWords(Users user) {

		List<Word> findAllWords = wordRepository.findByIsCompleteTrueAndUser(user);

		List<WordResponseDTO> response = new ArrayList<>();

		for(final Word word : findAllWords) {
			WordResponseDTO wordResponseDTO = new WordResponseDTO(word.getWordId(), word.getWord(),
				word.getWordMeaning(), word.isComplete());
			response.add(wordResponseDTO);
		}

		return response;
	}

	@Override
	public void deleteWord(Long wordId) {
		Word word = wordRepository.findById(wordId)
			.orElseThrow(() -> new IllegalArgumentException("단어로 찾을 수 없습니다. " + wordId));

		// 연관된 사용자로부터 단어 제거
		Users user = word.getUser();
		if (user != null) {
			user.removeWord(word);
		}

		wordRepository.delete(word);
	}


}
