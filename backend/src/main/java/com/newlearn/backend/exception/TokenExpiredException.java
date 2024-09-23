package com.newlearn.backend.exception;

import com.newlearn.backend.common.ErrorCode;

import lombok.Getter;

@Getter
public class TokenExpiredException extends RuntimeException{

	private final ErrorCode errorCode;

	public TokenExpiredException(ErrorCode errorCode) {
		super(errorCode.getMessage());
		this.errorCode = errorCode;
	}
}
