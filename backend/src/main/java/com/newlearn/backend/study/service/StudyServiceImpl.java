package com.newlearn.backend.study.service;

import com.newlearn.backend.config.S3ObjectStorage;
import com.newlearn.backend.study.dto.request.GoalRequestDTO;
import com.newlearn.backend.study.dto.request.PronounceRequestDTO;
import com.newlearn.backend.study.dto.request.WordTestResultRequestDTO;
import com.newlearn.backend.study.dto.response.*;
import com.newlearn.backend.study.model.Goal;
import com.newlearn.backend.study.model.UserAudioFile;
import com.newlearn.backend.study.repository.UserAudioFileRepository;
import com.newlearn.backend.user.repository.UserRepository;
import com.newlearn.backend.word.model.*;
import com.newlearn.backend.study.repository.StudyRepository;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.word.repository.WordQuizAnswerRepository;
import com.newlearn.backend.word.repository.WordQuizQuestionRepository;
import com.newlearn.backend.word.repository.WordQuizRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class StudyServiceImpl implements StudyService{

    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
    private final WordQuizRepository wordQuizRepository;
    private final WordQuizAnswerRepository wordQuizAnswerRepository;
    private final WordQuizQuestionRepository wordQuizQuestionRepository;
    private final UserAudioFileRepository userAudioFileRepository;
    private final S3ObjectStorage s3ObjectStorage;

    @Override
    public boolean isGoalExist(Long userId) {
        return studyRepository.existsByUserId(userId);
    }

    @Override
    public void saveGoal(Long userId, GoalRequestDTO goalRequestDTO) {
        Goal goal = Goal.builder()
            .userId(userId)
            .goalReadNewsCount(goalRequestDTO.getGoalReadNewsCount())
            .goalPronounceTestScore(goalRequestDTO.getGoalPronounceTestScore())
            .goalCompleteWord(goalRequestDTO.getGoalCompleteWord())
            .currentReadNewsCount(0L)
            .currentPronounceTestScore(0L)
            .currentCompleteWord(0L)
            .build();
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
        WordQuiz newQuiz = new WordQuiz();
        newQuiz.setUserId(userId);
        newQuiz.setTotalCount(totalCount);
        newQuiz.setCorrectCount(0L);
        wordQuizRepository.save(newQuiz);

        // 랜덤 단어 ${totalCount}개 가져오기
        List<Word> words = wordQuizQuestionRepository.findRandomWords(userId, totalCount);
        List<WordTestResponseDTO> tests = new ArrayList<>();

        for (Word word : words) {
            WordSentence sentence = wordQuizQuestionRepository.findRandomSentenceByWordId(word.getWordId());

            WordQuizQuestion question = new WordQuizQuestion();
            question.setWordQuiz(newQuiz);
            question.setSentence(sentence.getSentence());
            question.setSentenceMeaning(sentence.getSentenceMeaning());
            question.setCorrectAnswer(word.getWord());
            wordQuizQuestionRepository.save(question);

            tests.add(WordTestResponseDTO.builder()
                .word(word.getWord())
                .wordMeaning(word.getWordMeaning())
                .sentence(sentence.getSentence())
                .sentenceMeaning(sentence.getSentenceMeaning())
                .build());
        }
        return tests;
    }

    @Override
    public void saveWordTestResult(Long userId, WordTestResultRequestDTO wordTestResultRequestDTO) {
        for (WordTestResultRequestDTO.WordTestDetail result : wordTestResultRequestDTO.getResults()) {
            // 퀴즈 가져오기
            WordQuiz quiz = wordQuizRepository.findById(wordTestResultRequestDTO.getQuizId())
                    .orElseThrow(() -> new IllegalArgumentException("퀴즈를 찾을 수 없습니다."));

            // 질문 저장
            WordQuizQuestion question = WordQuizQuestion.builder()
                    .wordQuiz(quiz) // 퀴즈
                    .sentence(result.getSentence())
                    .correctAnswer(result.getCorrectAnswer())
                    .build();
            wordQuizQuestionRepository.save(question);

            // 답안 저장
            WordQuizAnswer answer = WordQuizAnswer.builder()
                    .wordQuizQuestion(question) // 질문
                    .answer(result.getAnswer())
                    .isCorrect(result.isCorrect())
                    .build();
            wordQuizAnswerRepository.save(answer);
        }
    }

    @Override
    public List<WordTestResultResponseDTO> getWordTestResults(Long userId) {
        // 유저와 관련된 모든 시험 가져오기
        List<WordQuiz> wordQuizzes = wordQuizRepository.findByUserId(userId);

        return wordQuizzes.stream().map(quiz -> {
            // 시험에 관련된 답변 가져오기
            List<WordQuizAnswer> answers = wordQuizAnswerRepository.findByWordQuizQuestion_WordQuiz_QuizId(quiz.getQuizId());

            String answer = answers.isEmpty() ? "" : answers.get(0).getAnswer();    // 정답이 안비었는지
            boolean isCorrect = quiz.getCorrectCount() > 0; // 정답 수가 0보다 큰지

            return WordTestResultResponseDTO.builder()
                    .quizId(quiz.getQuizId())
                    .answer(answer)
                    .totalCnt(String.valueOf(quiz.getTotalCount()))
                    .correctCnt(isCorrect)
                    .createAt(quiz.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public WordTestResultDetailResponseDTO getWordTestResult(Long userId, Long quizId) {
        // 퀴즈 가져오기
        WordQuiz quiz = wordQuizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("퀴즈를 찾을 수 없습니다."));

        // 퀴즈 질문 가져오기
        List<WordQuizQuestion> questions = wordQuizQuestionRepository.findByWordQuiz(quiz);

        // 결과 리스트는 하나의 질문과 답변만 포함
        if (questions.isEmpty()) {
            throw new IllegalArgumentException("퀴즈 질문이 없습니다.");
        }

        WordQuizQuestion question = questions.get(0);

        // 해당 질문에 대한 답변 찾기
        List<WordQuizAnswer> answers = wordQuizAnswerRepository.findByWordQuizQuestion_WordQuiz_QuizIdAndWordQuizQuestion_WordQuizQuestionId(quizId, question.getWordQuizQuestionId());

        // 첫 번째 답변을 기준으로 결과 생성
        String answer = answers.isEmpty() ? "" : answers.get(0).getAnswer();
        boolean isCorrect = !answers.isEmpty() && answers.get(0).getIsCorrect();

        WordTestResultDetailResponseDTO resultDetail = WordTestResultDetailResponseDTO.builder()
                .quizId(question.getWordQuizQuestionId())
                .answer(answer)
                .correctAnswer(question.getCorrectAnswer())
                .isCorrect(isCorrect)
                .sentence(question.getSentence())
                .createAt(quiz.getCreatedAt())
                .build();

        return resultDetail;
    }

    @Override
    public List<PronounceTestResponseDTO> getPronounceTestProblems(Long userId) {
        // 랜덤 단어 3개 가져오기
        List<Word> words = wordQuizQuestionRepository.findRandomWords(userId, 3L);
        List<PronounceTestResponseDTO> tests = new ArrayList<>();

        for (Word word : words) {
            WordSentence sentence = wordQuizQuestionRepository.findRandomSentenceByWordId(word.getWordId());

            tests.add(PronounceTestResponseDTO.builder()
                    .sentence(sentence.getSentence())
                    .sentenceMeaning(sentence.getSentenceMeaning())
                    .build());
        }
        return tests;
    }

    @Override
    public CompletableFuture<String> savePronounceTestResultAsync(Long userId, PronounceRequestDTO pronounceRequestDTO, MultipartFile file) {
        // 파일이 비어 있는지 확인
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("발음 테스트를 위한 파일이 제공되지 않았습니다.");
        }

        // 사용자 조회
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // S3에 파일 업로드
        String fileUrl = s3ObjectStorage.uploadFile(file).join();  // join()을 통해 CompletableFuture 결과 대기
        log.info("File uploaded to S3 with URL: {}", fileUrl);

        // DB에 파일 정보 저장
        UserAudioFile userAudioFile = UserAudioFile.builder()
                .userId(userId)
                .exampleSentence(pronounceRequestDTO.getExampleSentence())
                .pronunciationScore(pronounceRequestDTO.getTotalScore())
                .audioFileUrl(fileUrl)
                .createdAt(LocalDateTime.now(ZoneId.of("Asia/Seoul")))
                .build();
        userAudioFileRepository.save(userAudioFile);

        // 목표 업데이트
        Goal userGoal = studyRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No study goal found for user with id: " + userId));

        // 현재 발음 테스트 점수 업데이트
        long updatedScore = userGoal.getCurrentPronounceTestScore() + pronounceRequestDTO.getTotalScore();
        userGoal.setCurrentPronounceTestScore(updatedScore);
        studyRepository.save(userGoal);

        log.info("발음 테스트 결과가 성공적으로 저장되었습니다. 사용자 ID: {}, 점수: {}", userId, pronounceRequestDTO.getTotalScore());

        return CompletableFuture.completedFuture(fileUrl);
    }

    @Override
    public List<PronounceTestResultResponseDTO> getPronounceTestResults(Long userId) {
        // 사용자 ID로 발음 테스트 결과 조회
        List<UserAudioFile> audioFiles = userAudioFileRepository.findByUserId(userId);

        // 결과가 없는 경우 빈 리스트 반환
        if (audioFiles.isEmpty()) {
            return List.of();
        }

        // 발음 테스트 결과를 DTO로 변환
        List<PronounceTestResultResponseDTO> responseDTOs = audioFiles.stream()
                .map(file -> PronounceTestResultResponseDTO.builder()
                        .audioFileId(file.getAudioFileId())
                        .pronunciationScore(file.getPronunciationScore())
                        .createdAt(file.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return responseDTOs;
    }
}
