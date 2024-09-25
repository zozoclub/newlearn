package com.newlearn.backend.common;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
	// Internal Server Error
	INTERNAL_SERVER_ERROR("C001", HttpStatus.INTERNAL_SERVER_ERROR, "서버에 오류가 발생했습니다."),
	NOT_FOUND_API_URL("C002", HttpStatus.NOT_FOUND, "요청한 API url을 찾을 수 없습니다."),
	RESOURCE_NOT_FOUND("C003", HttpStatus.NOT_FOUND, "요청한 리소스를 찾을 수 없습니다."),
	ACCESS_DENIED("C004", HttpStatus.FORBIDDEN, "접근이 거부되었습니다."),

	// User Error
	USER_REGISTER_FAILED("U001", HttpStatus.BAD_REQUEST, "사용자 등록에 실패했습니다."),
	USER_NOT_FOUND("U002", HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
	PASSWORD_NOT_MATCH("U003", HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다."),
	USER_NOT_AUTHORIZED("U004", HttpStatus.FORBIDDEN, "해당 작업을 수행할 권한이 없습니다."),
	EMAIL_CODE_NOT_MATCH("U005", HttpStatus.BAD_REQUEST, "인증 코드가 일치하지 않습니다."),
	USER_DELETE_FAILED("U006", HttpStatus.BAD_REQUEST, "회원 탈퇴에 실패했습니다."),
	TEMP_USER_NOT_FOUND("U007", HttpStatus.NOT_FOUND, "임시 사용자를 찾을 수 없습니다."),
	OAUTH_CODE_NOT_FOUND("U008", HttpStatus.NOT_FOUND, "OAuth 코드를 찾을 수 없습니다."),
	USER_UPDATE_FAILED("U010", HttpStatus.BAD_REQUEST, "사용자 정보 업데이트에 실패했습니다."),
	EMAIL_ALREADY_EXIST("U011", HttpStatus.BAD_REQUEST, "이미 존재하는 이메일입니다."),
	NICKNAME_ALREADY_USED("U012", HttpStatus.BAD_REQUEST, "닉네임 중복 조회에 실패했습니다."),
	NICKNAME_NOT_FOUND("U013", HttpStatus.BAD_REQUEST, "닉네임 조회에 실패했습니다."),

	// Unauthorized
	AUTHENTICATION_FAILED("A001", HttpStatus.UNAUTHORIZED, "인증에 실패했습니다."),
	NO_JWT_TOKEN("A002", HttpStatus.UNAUTHORIZED, "JWT 토큰이 없습니다."),
	INVALID_JWT_TOKEN("A003", HttpStatus.UNAUTHORIZED, "유효하지 않은 JWT 토큰입니다."),
	ACCESS_TOKEN_EXPIRED("A004", HttpStatus.UNAUTHORIZED, "Access Token이 만료되었습니다."),
	REFRESH_TOKEN_EXPIRED("A005", HttpStatus.UNAUTHORIZED, "Refresh Token이 만료되었습니다."),
	REFRESH_TOKEN_BLACKLISTED("A006", HttpStatus.UNAUTHORIZED, "블랙리스트에 등록된 Refresh Token입니다."),
	REFRESH_TOKEN_NOT_FOUND("A007", HttpStatus.UNAUTHORIZED, "Refresh Token을 찾을 수 없습니다."),

	// AWS S3
	AWS_SERVER_ERROR("A008", HttpStatus.BAD_REQUEST, "AWS S3 서버 에러가 발생했습니다."),

	// File Error
	FILE_UPLOAD_FAILED("F001", HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드에 실패했습니다."),
	INVALID_FILE_FORMAT("F002", HttpStatus.BAD_REQUEST, "유효하지 않은 파일 형식입니다."),
	FILE_DOWNLOAD_FAILED("F003", HttpStatus.INTERNAL_SERVER_ERROR, "파일 다운로드에 실패했습니다"),
	S3_SERVER_ERROR("F004", HttpStatus.INTERNAL_SERVER_ERROR, "S3 서버에 문제가 발생하였습니다"),

	// Study Error
	GOAL_CREATE_FAILED("S001", HttpStatus.BAD_REQUEST, "목표 설정에 실패했습니다."),
	GOAL_ALREADY_EXISTS("S002", HttpStatus.BAD_REQUEST, "목표가 이미 존재합니다."),
	STUDY_PROGRESS_NOT_FOUND("S003", HttpStatus.NOT_FOUND, "학습 진도율 정보를 찾을 수 없습니다."),
	WORD_TEST_NOT_FOUND("S004", HttpStatus.NOT_FOUND, "단어 테스트 문제를 찾을 수 없습니다."),
	PRONOUNCE_TEST_TOO_SMALL("S011", HttpStatus.BAD_REQUEST, "단어장의 단어 개수가 적습니다."),
	WORD_TEST_RESULT_CREATE_FAILED("S006", HttpStatus.BAD_REQUEST, "단어 테스트 결과 저장에 실패했습니다."),
	WORD_TEST_RESULT_NOT_FOUND("S007", HttpStatus.NOT_FOUND, "단어 테스트 결과 리스트를 찾을 수 없습니다."),
	PRONOUNCE_TEST_NOT_FOUND("S008", HttpStatus.NOT_FOUND, "발음 테스트 문제를 찾을 수 없습니다."),
	PRONOUNCE_TEST_RESULT_UPDATE_FAILED("S009", HttpStatus.BAD_REQUEST, "발음 테스트 결과 저장에 실패했습니다."),
	PRONOUNCE_TEST_RESULT_NOT_FOUND("S010", HttpStatus.NOT_FOUND, "발음 테스트 결과 리스트를 찾을 수 없습니다."),


	// Word Error
	WORD_CREATE_FAILED("W001", HttpStatus.BAD_REQUEST, "단어를 추가할 수 없습니다"),
	WORD_FIND_FAILED("W002", HttpStatus.BAD_REQUEST, "단어 목록을 찾을 수 없습니다"),
	WORD_DELETE_FAILED("W003", HttpStatus.BAD_REQUEST, "단어를 삭제할 수 없습니다"),
	WORD_UPDATE_FAILED("W004", HttpStatus.BAD_REQUEST, "단어 외움 변경을 할 수 없습니다.");

	private final String code;
	private final HttpStatus httpStatus;
	private final String message;
}
