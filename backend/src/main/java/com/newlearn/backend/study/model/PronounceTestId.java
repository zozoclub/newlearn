package com.newlearn.backend.study.model;

import java.io.Serializable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class PronounceTestId implements Serializable {

    private Long audioFileId;
    private Long sentenceId;

}
