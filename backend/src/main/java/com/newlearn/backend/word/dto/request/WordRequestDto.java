package com.newlearn.backend.word.dto.request;

import java.time.LocalDateTime;

import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.word.model.Word;
import com.newlearn.backend.word.model.WordSentence;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WordRequestDto {

	private Long newsId;
	private String word;
	private	Long difficulty; //해당 문장의 난이도
	private String wordMeaning;
	private String sentence;
	private String sentenceMeaning;
	private String pronounceUs;
	private String pronounceUk;

	public Word toWordEntity(Users user) {
		return Word.builder()
			.user(user)
			.word(word)
			.wordMeaning(wordMeaning)
			.isComplete(false)
			.restudyLevel(0L)
			.isFinalComplete(false)
			.pronounceUs(pronounceUs)
			.pronounceUk(pronounceUk)
			.createdAt(LocalDateTime.now())
			.build();
	}

	public WordSentence toSentenceEntity(Word word) {
		return WordSentence.builder()
			.word(word)
			.newsId(newsId)
			.difficulty(difficulty)
			.sentence(sentence)
			.sentenceMeaning(sentenceMeaning)
			.createdAt(LocalDateTime.now())
			.build();
	}
}
