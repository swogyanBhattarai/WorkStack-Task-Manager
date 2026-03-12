package com.justdeepfried.WorkStack.dto.User;

import com.justdeepfried.WorkStack.dto.Activity.ActivityResponse;
import com.justdeepfried.WorkStack.model.UserModel;

import java.time.LocalDateTime;
import java.util.List;

public record UserResponse (
        int id,
        String username,
        List<String> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static UserResponse from(UserModel user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRoles(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

}
