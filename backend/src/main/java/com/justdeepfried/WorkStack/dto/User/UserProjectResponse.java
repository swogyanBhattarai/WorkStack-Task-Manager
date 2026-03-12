package com.justdeepfried.WorkStack.dto.User;

import com.justdeepfried.WorkStack.model.ProjectModel;
import com.justdeepfried.WorkStack.model.TaskModel;

import java.util.List;

public record UserProjectResponse (
        Integer projectId,
        String projectName,
        String description,
        List<TaskModel> tasks
) {
    public static UserProjectResponse from(ProjectModel project) {
        return new UserProjectResponse(
                project.getProjectId(),
                project.getProjectName(),
                project.getDescription(),
                project.getTasks()
        );
    }

    public static List<UserProjectResponse> fromList(List<ProjectModel> projects) {
        return projects.stream()
                .map(UserProjectResponse::from)
                .toList();
    }
}
