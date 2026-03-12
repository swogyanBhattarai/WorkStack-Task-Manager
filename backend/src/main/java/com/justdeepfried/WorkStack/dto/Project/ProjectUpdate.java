package com.justdeepfried.WorkStack.dto.Project;

import com.justdeepfried.WorkStack.model.ProjectModel;

import java.util.List;

public record ProjectUpdate (
        String projectName,
        String projectDescription,
        ProjectModel.Status projectStatus,
        List<Integer> userIds,
        List<Integer> taskIds
) {
}
