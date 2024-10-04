package com.newlearn.backend.word.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.newlearn.backend.study.model.Goal;
import com.newlearn.backend.study.repository.StudyRepository;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newlearn.backend.news.model.News;
import com.newlearn.backend.news.repository.NewsRepository;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.word.dto.request.RestudyResultRequestDTO;
import com.newlearn.backend.word.dto.request.WordRequestDto;
import com.newlearn.backend.word.dto.response.RestudyWordResponseDTO;
import com.newlearn.backend.word.dto.response.WordDetailResponseDTO;
import com.newlearn.backend.word.dto.response.WordResponseDTO;
import com.newlearn.backend.word.model.Word;
import com.newlearn.backend.word.model.WordSentence;
import com.newlearn.backend.word.repository.WordRepository;
import com.newlearn.backend.word.repository.WordSentenceRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class WordServiceImpl implements WordService {

	private final WordRepository wordRepository;
	private final WordSentenceRepository wordSentenceRepository;
	private final NewsRepository newsRepository;
	private final StudyRepository studyRepository;

	@Transactional
	@Override
	public void addWord(WordRequestDto wordRequestDto, Users user) throws Exception {

		List<Word> words = wordRepository.findAllByWordAndUser(wordRequestDto.getWord(), user);
		for(Word word : words) {
			if(word.getSentence().getSentence().equals(wordRequestDto.getSentence())) {
				throw new Exception("중복 단어입니다");
			}
		}

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

		for(Word word : findAllWords) {
			if(!word.isDelete()) {
				WordResponseDTO wordResponseDTO = new WordResponseDTO(word.getWordId(), word.getWord(),
					word.getWordMeaning(), word.isComplete());
				response.add(wordResponseDTO);
			}
		}

		return response;
	}

	@Override
	public List<WordResponseDTO> getCompleteWords(Users user) {

		List<Word> findAllWords = wordRepository.findByIsCompleteTrueAndUser(user);

		List<WordResponseDTO> response = new ArrayList<>();

		for(Word word : findAllWords) {
			if(!word.isComplete()) {
				WordResponseDTO wordResponseDTO = new WordResponseDTO(word.getWordId(), word.getWord(),
					word.getWordMeaning(), word.isComplete());
				response.add(wordResponseDTO);
			}
		}

		return response;
	}

	@Override
	public void deleteWord(Long wordId) {
		Word word = wordRepository.findById(wordId)
				.orElseThrow(() -> new IllegalArgumentException("단어로 찾을 수 없습니다. " + wordId));

		word.delete();
		wordRepository.save(word);
	}

	@Override
	public WordDetailResponseDTO getWordDetail(String word, Users user) throws Exception {

		List<Word> words = wordRepository.findAllByWordAndUser(word, user);
		if (words.isEmpty()) {
			throw new IllegalArgumentException("해당 단어를 찾을 수 없습니다.");
		}

		String wordMeaning = words.get(0).getWordMeaning();
		List<WordDetailResponseDTO.SentenceResponseDTO> sentenceDTO = words.stream()
				.map(w -> {
					try {
						return new WordDetailResponseDTO.SentenceResponseDTO(
								w.getSentence().getNewsId(),
								w.getSentence().getDifficulty(),
								w.getSentence().getSentence(),
								w.getSentence().getSentenceMeaning(),
								getUrl(w.getSentence().getNewsId()),
								w.getPronounceUs(),
								w.getPronounceUk(),
								w.getAudioUs(),
								w.getAudioUk()
						);
					} catch (Exception e) {
						throw new RuntimeException(e);
					}
				}).toList();
		return new WordDetailResponseDTO(word, wordMeaning, sentenceDTO);

	}

	private String getUrl(Long newsId) throws Exception {
		News news = newsRepository.findById(newsId).orElseThrow(() -> new Exception("뉴스 없음요"));
		return news.getUrl();
	}

	@Transactional
	public void completeWord(Long wordId, Users user) {
		Word word = wordRepository.findById(wordId)
				.orElseThrow(() -> new IllegalArgumentException("해당 단어를 찾을 수 없"));

		if (!word.getUser().equals(user)) {
			throw new IllegalStateException("사용자와 단어가 일치하지 않습니다.");
		}

		word.completeWord();
		wordRepository.save(word);

//		Optional<Goal> optionalGoal = studyRepository.findByUserId(user.getUserId());
//		if (optionalGoal.isPresent()) {
//			Goal goal = optionalGoal.get();
//
//			if (word.isComplete()) {
//				goal.setCurrentCompleteWord(goal.getCurrentCompleteWord() + 1);
//			} else {
//				goal.setCurrentCompleteWord(goal.getCurrentCompleteWord() - 1);
//			}
//			studyRepository.save(goal);
//		}
	}

	/**
	 * 이건 이제 외움처리는 했는데 최종적으로 외우진 않아서 망각곡선 안에 있는 애들
	 * 다음에 오늘 외워야 하는 날이거나 전에 있는 날인 애들
	 * 이거 테스트할때 단어 없을 떄 한번 테스트 해보자
	 */
	@Override
	public List<RestudyWordResponseDTO> getWordsForRestudy(Users user) {

		LocalDateTime now = LocalDateTime.now();
		List<Word> words = wordRepository.findByUserAndNextRestudyDateLessThanEqualAndIsFinalCompleteFalseAndIsCompleteTrue(
				user, now);

		List<RestudyWordResponseDTO> response = new ArrayList<>();

		for(Word nowWord : words) {
			WordSentence nowSentence = nowWord.getSentence();
			RestudyWordResponseDTO dto = new RestudyWordResponseDTO(nowWord.getWordId(), nowWord.getWord(),
					nowWord.getWordMeaning(), nowSentence.getSentence(), nowSentence.getSentenceMeaning(),
					nowWord.getRestudyLevel());
			response.add(dto);
		}

		return response;
	}

	//단어 입력 결과!
	//나중에 이건 결과를 리턴해주는게 나을 거같다
	//예를들어 맞추면, 맞춰서 이제 다음 출제 되는날, 아니면 내일
	@Override
	public void processRestudy(Long wordId, boolean isCorrect) {
		Word word = wordRepository.findById(wordId)
				.orElseThrow(() -> new EntityNotFoundException("단어가 없슴요"));

		word.restudy(isCorrect);
		wordRepository.save(word);
	}

	//이건 오늘은 풀지 않기
	//이 기능을 해서, 오늘 문제를 내일로 미룰 수 있음
	@Override
	public void skipRestudy(Long wordId) {
		Word word = wordRepository.findById(wordId)
				.orElseThrow(() -> new EntityNotFoundException("Word not found"));

		word.setNextRestudyDate(LocalDateTime.now().plusDays(1));
		wordRepository.save(word);
	}

	//단어 진짜 안나오게 하기
	@Override
	public void finalCompleteRestudy(Long wordId) {

		Word word = wordRepository.findById(wordId)
				.orElseThrow(() -> new EntityNotFoundException("Word not found"));

		//만약 아직 외운 단어가 아니라면
		if(!word.isComplete()) {
			throw new RuntimeException("외운 단어가 아닙니다");
		}

		word.setFinalComplete(true);
		wordRepository.save(word);
	}

	@Override
	public void exitAndSaveResult(List<RestudyResultRequestDTO> results) {

		for(RestudyResultRequestDTO r : results) {
			Word nowWord = wordRepository.findById(r.getWordId()).orElseThrow(() -> new EntityNotFoundException("Word not found"));

			//만약 참여를 했다면,
			if(r.isDoing()) {
				//참여를 했는데 만약, 정답을 맞췄으면, 혹은 안했다면
				nowWord.restudy(r.isCorrect());
			}
			else {
				nowWord.setNextRestudyDate(LocalDateTime.now().plusDays(1));
			}
			wordRepository.save(nowWord);
		}
	}

}
