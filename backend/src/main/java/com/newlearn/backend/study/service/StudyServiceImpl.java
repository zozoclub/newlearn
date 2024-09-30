package com.newlearn.backend.study.service;

import com.newlearn.backend.config.S3ObjectStorage;
import com.newlearn.backend.study.dto.request.GoalRequestDTO;
import com.newlearn.backend.study.dto.request.PronounceRequestDTO;
import com.newlearn.backend.study.dto.request.WordTestResultRequestDTO;
import com.newlearn.backend.study.dto.response.*;
import com.newlearn.backend.study.model.Goal;
import com.newlearn.backend.study.model.PronounceTest;
import com.newlearn.backend.study.model.UserAudioFile;
import com.newlearn.backend.study.repository.PronounceTestRepository;
import com.newlearn.backend.study.repository.UserAudioFileRepository;
import com.newlearn.backend.user.repository.UserRepository;
import com.newlearn.backend.word.model.*;
import com.newlearn.backend.study.repository.StudyRepository;
import com.newlearn.backend.user.model.Users;
import com.newlearn.backend.word.repository.WordQuizAnswerRepository;
import com.newlearn.backend.word.repository.WordQuizQuestionRepository;
import com.newlearn.backend.word.repository.WordQuizRepository;
import com.newlearn.backend.word.repository.WordSentenceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
    private final WordSentenceRepository wordSentenceRepository;
    private final UserAudioFileRepository userAudioFileRepository;
    private final PronounceTestRepository pronounceTestRepository;
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
    public WordTestResponseWithQuizIdDTO getWordTestProblems(Long userId, Long totalCount) {
        WordQuiz newQuiz = new WordQuiz();
        newQuiz.setUserId(userId);
        newQuiz.setTotalCount(totalCount);
        newQuiz.setCorrectCount(0L);
        wordQuizRepository.save(newQuiz);

        List<Word> words = wordQuizQuestionRepository.findRandomWords(userId, totalCount);
        List<WordTestResponseDTO> tests = new ArrayList<>();

        for (Word word : words) {
            WordSentence sentence = wordQuizQuestionRepository.findRandomSentenceByWordId(word.getWordId());

            WordQuizQuestion question = new WordQuizQuestion();
            question.setWordQuiz(newQuiz);
            question.setWord(word);
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

        return WordTestResponseWithQuizIdDTO.builder()
                .quizId(newQuiz.getQuizId())
                .tests(tests)
                .build();
    }

    @Override
    public void saveWordTestResult(Long userId, WordTestResultRequestDTO wordTestResultRequestDTO) {
        // 퀴즈 가져오기
        WordQuiz quiz = wordQuizRepository.findById(wordTestResultRequestDTO.getQuizId())
                .orElseThrow(() -> new IllegalArgumentException("퀴즈를 찾을 수 없습니다."));

        // 정답 개수 초기화
        Long correctCount = quiz.getCorrectCount();

        for (WordTestResultRequestDTO.WordTestDetail result : wordTestResultRequestDTO.getResults()) {
            // 질문 찾기
            System.out.println("ㅎㅎ" + quiz + " " + result.getSentence());
            WordQuizQuestion question = wordQuizQuestionRepository.findByWordQuizAndSentence(quiz, result.getSentence())
                    .orElseThrow(() -> new IllegalArgumentException("해당 질문을 찾을 수 없습니다."));

            // 답안 저장
            WordQuizAnswer answer = WordQuizAnswer.builder()
                    .wordQuizQuestion(question)
                    .answer(result.getAnswer())
                    .isCorrect(result.isCorrect())
                    .build();

            wordQuizAnswerRepository.save(answer); // 답안 저장

            // 답안이 맞으면 correctCount 증가
            if (result.isCorrect()) {
                correctCount++;
            }
        }
        // correctCount 갱신
        quiz.setCorrectCount(correctCount);
        wordQuizRepository.save(quiz); // 퀴즈 저장 (정답 수 갱신)
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
                    .totalCnt(quiz.getTotalCount())
                    .correctCnt(quiz.getCorrectCount())
                    .createdAt(quiz.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public List<WordTestResultDetailResponseDTO> getWordTestResult(Long userId, Long quizId) {
        // 퀴즈 가져오기
        WordQuiz quiz = wordQuizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("퀴즈를 찾을 수 없습니다."));

        // 퀴즈 질문 가져오기
        List<WordQuizQuestion> questions = wordQuizQuestionRepository.findByWordQuiz(quiz);

        // 결과 리스트는 질문과 답변들을 포함
        if (questions.isEmpty()) {
            throw new IllegalArgumentException("퀴즈 질문이 없습니다.");
        }

        // 반환할 결과 리스트
        List<WordTestResultDetailResponseDTO> resultList = new ArrayList<>();

        // 각 질문에 대해 처리
        for (WordQuizQuestion question : questions) {
            // 해당 질문에 대한 하나의 답변 가져오기
            Optional<WordQuizAnswer> answerObj = wordQuizAnswerRepository.findByWordQuizQuestion_WordQuizQuestionId(question.getWordQuizQuestionId());
            System.out.println(answerObj);

            // 답변이 없는 경우 빈 문자열과 false 설정
            String answer = answerObj.map(WordQuizAnswer::getAnswer).orElse("");
            boolean isCorrect = answerObj.map(WordQuizAnswer::getIsCorrect).orElse(false);

            // DTO 빌드 및 리스트에 추가
            WordTestResultDetailResponseDTO result = WordTestResultDetailResponseDTO.builder()
                    .quizId(question.getWordQuizQuestionId())
                    .answer(answer)
                    .correctAnswer(question.getCorrectAnswer())
                    .isCorrect(isCorrect)
                    .sentence(question.getSentence())
                    .createdAt(quiz.getCreatedAt())
                    .build();

            resultList.add(result);
        }

        return resultList;
    }

    @Override
    public void exitQuiz(Long quizId) {
        WordQuiz quiz = wordQuizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("퀴즈를 찾을 수 없습니다."));

        wordQuizRepository.deleteById(quizId);
    }

    @Override
    public List<PronounceTestResponseDTO> getPronounceTestProblems(Long userId) {
        // 랜덤 단어 3개 가져오기
        List<Word> words = wordQuizQuestionRepository.findRandomWords(userId, 3L);
        List<PronounceTestResponseDTO> tests = new ArrayList<>();

        for (Word word : words) {
            WordSentence sentence = wordQuizQuestionRepository.findRandomSentenceByWordId(word.getWordId());

            tests.add(PronounceTestResponseDTO.builder()
                    .sentenceId(sentence.getSentenceId())
                    .sentence(sentence.getSentence())
                    .sentenceMeaning(sentence.getSentenceMeaning())
                    .build());
        }
        return tests;
    }

    @Override
    public CompletableFuture<Long> savePronounceTestResultAsync(Long userId, PronounceRequestDTO pronounceRequestDTO,
                                                                MultipartFile file, List<Long> sentenceIds) {
        // 파일이 비어 있는지 확인
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("발음 테스트를 위한 파일이 제공되지 않았습니다.");
        }

        // 사용자 조회
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // S3에 파일 업로드
        String fileUrl = s3ObjectStorage.uploadFile(file).join(); // join()을 통해 CompletableFuture 결과 대기
        log.info("File uploaded to S3 with URL: {}", fileUrl);

        // DB에 파일 정보 저장
        UserAudioFile userAudioFile = UserAudioFile.builder()
                .userId(userId)
                .audioFileUrl(fileUrl)
                .accuracyScore(pronounceRequestDTO.getAccuracyScore())
                .fluencyScore(pronounceRequestDTO.getFluencyScore())
                .completenessScore(pronounceRequestDTO.getCompletenessScore())
                .prosodyScore(pronounceRequestDTO.getProsodyScore())
                .totalScore(pronounceRequestDTO.getTotalScore())
                .createdAt(LocalDateTime.now(ZoneId.of("Asia/Seoul")))
                .build();
        userAudioFile = userAudioFileRepository.save(userAudioFile); // 저장하고 엔티티를 다시 가져옴

        // 발음 테스트 문장 저장
        for (Long sentenceId : sentenceIds) {
            PronounceTest pronounceTest = new PronounceTest();
            pronounceTest.setAudioFileId(userAudioFile.getAudioFileId());
            pronounceTest.setSentenceId(sentenceId);
            pronounceTest.setCreatedAt(LocalDateTime.now(ZoneId.of("Asia/Seoul")));

            // PronounceTest 결과 저장
            pronounceTestRepository.save(pronounceTest);
        }

        // 목표 업데이트
        Goal userGoal = studyRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No study goal found for user with id: " + userId));

        // 현재 발음 테스트 점수 업데이트
        long updatedScore = userGoal.getCurrentPronounceTestScore() + pronounceRequestDTO.getTotalScore();
        userGoal.setCurrentPronounceTestScore(updatedScore);
        studyRepository.save(userGoal);

        log.info("발음 테스트 결과가 성공적으로 저장되었습니다. 사용자 ID: {}, 점수: {}", userId, pronounceRequestDTO.getTotalScore());

        return CompletableFuture.completedFuture(userAudioFile.getAudioFileId()); // audioFileId 반환
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
                        .totalScore(file.getTotalScore())
                        .createdAt(file.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return responseDTOs;
    }

    @Override
    public PronounceTestResultDetailResponseDTO getPronounceTestResult(Long audioFileId) {
        // 사용자 오디오 파일 정보 조회
        UserAudioFile userAudioFile = userAudioFileRepository.findById(audioFileId)
                .orElse(null); // Optional 처리

        // 오디오 파일 정보가 없으면 null 반환
        if (userAudioFile == null) {
            return null;
        }

        // 발음 테스트 결과 조회
        List<PronounceTest> pronounceTests = pronounceTestRepository.findByAudioFileId(audioFileId);

        // DTO 변환 및 반환
        return PronounceTestResultDetailResponseDTO.builder()
                .audioFileId(userAudioFile.getAudioFileId())
                .audioFileUrl(userAudioFile.getAudioFileUrl())
                .accuracyScore(userAudioFile.getAccuracyScore())
                .fluencyScore(userAudioFile.getFluencyScore())
                .completenessScore(userAudioFile.getCompletenessScore())
                .prosodyScore(userAudioFile.getProsodyScore())
                .totalScore(userAudioFile.getTotalScore())
                .createdAt(userAudioFile.getCreatedAt())
                .tests(getTestSentences(pronounceTests)) // 문장 정보 가져오기
                .build();
    }

    private List<PronounceTestResultDetailResponseDTO.TestSentenceDTO> getTestSentences(List<PronounceTest> pronounceTests) {
        List<PronounceTestResultDetailResponseDTO.TestSentenceDTO> testSentences = new ArrayList<>();

        for (PronounceTest pronounceTest : pronounceTests) {
            WordSentence wordSentence = wordSentenceRepository.findById(pronounceTest.getSentenceId()).orElse(null);

            if (wordSentence != null) {
                testSentences.add(
                        PronounceTestResultDetailResponseDTO.TestSentenceDTO.builder()
                                .sentence(wordSentence.getSentence())
                                .sentenceMeaning(wordSentence.getSentenceMeaning())
                                .build()
                );
            }
        }
        return testSentences;
    }
}
