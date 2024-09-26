package com.newlearn.backend.user.dto.request;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Getter
@Builder
public class NewsPagenationRequestDTO {
    private Integer page;
    private Integer size;

    public Pageable getPageable() {
        return PageRequest.of(this.page, this.size);
    }
}
