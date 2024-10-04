package com.newlearn.backend.study.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class WordTestResultDetailDTO {

    private LocalDateTime createAt;
    private List<WordTestResultDetailResponseDTO> result;

}
