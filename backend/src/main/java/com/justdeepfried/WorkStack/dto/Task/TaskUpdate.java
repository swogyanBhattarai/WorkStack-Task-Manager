package com.justdeepfried.WorkStack.dto.Task;

import com.justdeepfried.WorkStack.model.TaskModel;

import java.util.List;

public record TaskUpdate (
        String taskName,
        String taskDescription,
        TaskModel.TaskStatus taskStatus,
        List<String> taskLabels,
        String dueDate
) {
}
