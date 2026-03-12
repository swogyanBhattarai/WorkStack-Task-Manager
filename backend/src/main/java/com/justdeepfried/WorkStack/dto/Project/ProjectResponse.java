package com.justdeepfried.WorkStack.dto.Project;

import com.justdeepfried.WorkStack.dto.PageResponse;
import com.justdeepfried.WorkStack.dto.Task.TaskProjectResponse;
import com.justdeepfried.WorkStack.dto.User.UserResponse;
import com.justdeepfried.WorkStack.model.ProjectModel;
import com.justdeepfried.WorkStack.model.TaskModel;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectResponse (
        int projectId,
        String projectName,
        String description,
        ProjectModel.Status projectStatus,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<ProjectUserResponse> users,
        List<ProjectTaskResponse> tasks
) {
    public static ProjectResponse from(ProjectModel projectModel) {
        return new ProjectResponse(
                projectModel.getProjectId(),
                projectModel.getProjectName(),
                projectModel.getDescription(),
                projectModel.getProjectStatus(),
                projectModel.getCreatedAt(),
                projectModel.getUpdatedAt(),
                projectModel.getUsers()
                        .stream()
                        .map(ProjectUserResponse::from)
                        .toList(),
                projectModel.getTasks()
                        .stream()
                        .map(ProjectTaskResponse::from)
                        .toList()
        );
    }

    public static List<ProjectResponse> fromList(List<ProjectModel> projects) {
        return projects.stream()
                .map(ProjectResponse::from)
                .toList();
    }
}
