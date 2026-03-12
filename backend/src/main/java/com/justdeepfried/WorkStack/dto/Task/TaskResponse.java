package com.justdeepfried.WorkStack.dto.Task;

import com.justdeepfried.WorkStack.dto.Project.ProjectResponse;
import com.justdeepfried.WorkStack.model.TaskModel;

import java.time.LocalDateTime;
import java.util.List;

public record TaskResponse (
        int taskId,
        String taskName,
        String taskDescription,
        TaskModel.TaskStatus taskStatus,
        String dueDate,
        List<String> takLabels,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        TaskProjectResponse project
) {
    public static TaskResponse from(TaskModel task) {
        return new TaskResponse(
                task.getTaskId(),
                task.getTaskName(),
                task.getTaskDescription(),
                task.getTaskStatus(),
                task.getDueDate(),
                task.getTaskLabels(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.getProject() != null ? TaskProjectResponse.from(task.getProject()) : null
        );
    }

    public static List<TaskResponse> formList(List<TaskModel> tasks) {
        return tasks.stream()
                .map(TaskResponse::from)
                .toList();
    }
}
