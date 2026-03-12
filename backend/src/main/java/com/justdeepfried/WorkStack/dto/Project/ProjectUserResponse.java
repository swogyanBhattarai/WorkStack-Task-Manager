package com.justdeepfried.WorkStack.dto.Project;

import com.justdeepfried.WorkStack.model.UserModel;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectUserResponse (
        int id,
        String username,
        List<String> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProjectUserResponse from(UserModel user) {
        return new ProjectUserResponse(
                user.getId(),
                user.getUsername(),
                user.getRoles(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
