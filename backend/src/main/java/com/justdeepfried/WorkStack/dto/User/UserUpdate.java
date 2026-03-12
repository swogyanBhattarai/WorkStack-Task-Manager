package com.justdeepfried.WorkStack.dto.User;

import com.justdeepfried.WorkStack.dto.Activity.ActivityResponse;
import com.justdeepfried.WorkStack.model.ProjectModel;

import java.util.List;

public record UserUpdate (
        String username,
        List<String> roles,
        List<Integer> projectIds
) {
}
