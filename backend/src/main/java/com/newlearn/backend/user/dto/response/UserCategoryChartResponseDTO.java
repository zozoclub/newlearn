package com.newlearn.backend.user.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class UserCategoryChartResponseDTO {
	private Long politicsCount;
	private Long economyCount;
	private Long societyCount;
	private Long cultureCount;
	private Long scienceCount;
	private Long worldCount;
}
