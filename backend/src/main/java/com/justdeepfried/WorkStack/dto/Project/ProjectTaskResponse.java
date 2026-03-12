package com.justdeepfried.WorkStack.dto.Project;

import com.justdeepfried.WorkStack.model.TaskModel;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectTaskResponse (
        int taskId,
        String taskName,
        String taskDescription,
        TaskModel.TaskStatus taskStatus,
        String dueDate,
        List<String> takLabels,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProjectTaskResponse from(TaskModel task) {
        return new ProjectTaskResponse(
                task.getTaskId(),
                task.getTaskName(),
                task.getTaskDescription(),
                task.getTaskStatus(),
                task.getDueDate(),
                task.getTaskLabels(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}