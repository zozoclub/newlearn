package com.newlearn.backend.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class UserGrassResponseDTO {
    private LocalDate date;
    private Long count;
}
