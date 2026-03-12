package com.justdeepfried.WorkStack.dto.Task;

import com.justdeepfried.WorkStack.model.ProjectModel;


public record TaskProjectResponse (
        int projectId,
        String projectName,
        String description,
        ProjectModel.Status projectStatus
) {
    public static TaskProjectResponse from(ProjectModel project) {
        return new TaskProjectResponse(
                project.getProjectId(),
                project.getProjectName(),
                project.getDescription(),
                project.getProjectStatus()
        );
    }
}
