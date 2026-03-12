package com.justdeepfried.WorkStack.dto;

import org.springframework.data.domain.Page;

import java.util.List;

public record PageResponse<T> (
        List<T> content,
        int pageNumber,
        int pageSize,
        int numberOfElements,
        long totalElements,
        int totalPages
) {

    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getNumberOfElements(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

}
