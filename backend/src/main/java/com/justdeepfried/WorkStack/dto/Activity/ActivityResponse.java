package com.justdeepfried.WorkStack.dto.Activity;

import com.justdeepfried.WorkStack.model.ActivityLogModel;

import java.time.LocalDateTime;
import java.util.List;

public record ActivityResponse (
        int activityId,
        ActivityLogModel.Activity activity,
        int userId,
        String username,
        String activityDescription,
        LocalDateTime createdAt
) {
    public static ActivityResponse from(ActivityLogModel activity) {
        int userId = 9999;
        String username = "SYSTEM";

        if (activity.getUser() != null) {
            userId = activity.getUser().getId();
            username = activity.getUser().getUsername();
        }

        return new ActivityResponse(
                activity.getActivityId(),
                activity.getActivity(),
                userId,
                username,
                activity.getActivityDescription(),
                activity.getCreatedAt()
        );
    }

    public static List<ActivityResponse> fromList(List<ActivityLogModel> activity) {
        return activity.stream()
                .map(ActivityResponse::from)
                .toList();
    }
}
