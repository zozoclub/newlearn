package com.newlearn.backend.study.service;

import com.newlearn.backend.study.dto.request.GoalRequestDTO;
import com.newlearn.backend.study.dto.response.StudyProgressDTO;
import com.newlearn.backend.study.dto.response.WordTestResponseDTO;
import com.newlearn.backend.study.model.Goal;
import com.newlearn.backend.study.repository.StudyRepository;
import com.newlearn.backend.word.model.Word;
import com.newlearn.backend.word.model.WordSentence;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class StudyServiceImpl implements StudyService{

    private final StudyRepository studyRepository;

    @Override
    public void saveGoal(Long userId, GoalRequestDTO goalRequestDTO) {
        Goal goal = studyRepository.findByUserId(userId).orElseThrow(() -> new EntityNotFoundException("Goal not found"));
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

    @Override
    public List<WordTestResponseDTO> getWordTestProblems(Long userId, Long totalCount) {
        List<Word> words = studyRepository.findRandomWords(userId, totalCount);
        return words.stream().map(word -> {
            WordSentence sentence = studyRepository.findRandomSentenceByWordId(word.getWordId());
            return WordTestResponseDTO.builder()
                    .word(word.getWord())
                    .wordMeaning(word.getMeaning())
                    .sentence(sentence.getSentence())
                    .sentenceMeaning(sentence.getSentenceMeaning())
                    .build();
        }).collect(Collectors.toList());
    }
}
