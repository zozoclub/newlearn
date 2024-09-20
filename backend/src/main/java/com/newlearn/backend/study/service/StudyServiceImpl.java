package com.newlearn.backend.study.service;

import com.newlearn.backend.study.dto.request.GoalRequestDTO;
import com.newlearn.backend.study.dto.request.WordTestResultDTO;
import com.newlearn.backend.study.dto.response.StudyProgressDTO;
import com.newlearn.backend.study.dto.response.WordTestResponseDTO;
import com.newlearn.backend.study.model.Goal;
import com.newlearn.backend.study.repository.StudyRepository;
import com.newlearn.backend.word.model.Word;
import com.newlearn.backend.word.model.WordQuiz;
import com.newlearn.backend.word.model.WordQuizQuestion;
import com.newlearn.backend.word.model.WordSentence;
import com.newlearn.backend.word.repository.WordQuizQuestionRepository;
import com.newlearn.backend.word.repository.WordRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class StudyServiceImpl implements StudyService{

    private final StudyRepository studyRepository;
    private final WordRepository wordRepository;
    private final WordQuizQuestionRepository wordQuizQuestionRepository;

    @Override
    public void saveGoal(Long userId, GoalRequestDTO goalRequestDTO) {
        Goal goal = studyRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Goal not found"));
        goal.setGoalReadNewsCount(goalRequestDTO.getGoalReadNewsCount());
        goal.setGoalPronounceTestScore(goalRequestDTO.getGoalPronounceTestScore());
        goal.setGoalCompleteWord(goalRequestDTO.getGoalCompleteWord());

        studyRepository.save(goal);
    }

    @Override
    public StudyProgressDTO getStudyProgress(Long userId) {
        Goal goal = studyRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("목표가 없습니다."));

        return StudyProgressDTO.builder()
                .goalReadNewsCount(goal.getGoalReadNewsCount())
                .goalPronounceTestScore(goal.getGoalPronounceTestScore())
                .goalCompleteWord(goal.getGoalCompleteWord())
                .currentReadNewsCount(goal.getCurrentReadNewsCount())
                .currentPronounceTestScore(goal.getCurrentPronounceTestScore())
                .currentCompleteWord(goal.getCurrentCompleteWord())
                .build();
    }

//    @Override
//    public List<WordTestResponseDTO> getWordTestProblems(Long userId, Long totalCount) {
//        WordQuiz newQuiz = new WordQuiz();
//        newQuiz.setUserId(userId);
//        newQuiz.setTotalCount(totalCount);
//        newQuiz.setCorrectCount(0L);
//        wordQuizRepository.save(newQuiz);
//
//        List<Word> words = wordQuizQuestionRepository.findRandomWords(userId, totalCount);
//        List<WordTestResponseDTO> tests = new ArrayList<>();
//
//        for (Word word : words) {
//            WordSentence sentence = wordQuizQuestionRepository.findRandomSentenceByWordId(word.getWordId());
//
//            WordQuizQuestion question = new WordQuizQuestion();
//            question.setQuiz(newQuiz);
//            question.setWord(word);
//            question.setSentence(sentence.getSentence());
//            question.setSentenceMeaning(sentence.getSentenceMeaning());
//            question.setCorrectAnswer(word.getWord());
//            wordQuizQuestionRepository.save(question);
//
//            tests.add(WordTestResponseDTO.builder()
//                    .word(word.getWord())
//                    .wordMeaning(word.getWordMeaning())
//                    .sentence(sentence.getSentence())
//                    .sentenceMeaning(sentence.getSentenceMeaning())
//                    .build());
//        }
//
//        return tests;
//    }


    @Override
    public void saveWordTestResults(Long userId, List<WordTestResultDTO> wordTestResults) {

        //

        for (WordTestResultDTO result : wordTestResults) {



//            studyRepository.save();
        }
    }
}
