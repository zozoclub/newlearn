package com.newlearn.backend.study.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WordTestResponseDTO {
    private String word;
    private String wordMeaning;
    private String sentence;
    private String sentenceMeaning;
}
