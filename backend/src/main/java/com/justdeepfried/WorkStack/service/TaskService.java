package com.justdeepfried.WorkStack.service;

import com.justdeepfried.WorkStack.dto.PageResponse;
import com.justdeepfried.WorkStack.dto.Task.TaskResponse;
import com.justdeepfried.WorkStack.dto.Task.TaskUpdate;
import com.justdeepfried.WorkStack.exception.ResourceNotFound;
import com.justdeepfried.WorkStack.model.ActivityLogModel;
import com.justdeepfried.WorkStack.model.TaskModel;
import com.justdeepfried.WorkStack.repository.TaskRepo;
import com.justdeepfried.WorkStack.specification.TaskSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    @Autowired
    private TaskRepo taskRepo;

    @Autowired
    private ActivityLogService activityLogService;

    public PageResponse<TaskResponse> getAll(Pageable pageable) {
        return PageResponse.from(taskRepo.findAll(pageable).map(TaskResponse::from));
    }

    public PageResponse<TaskResponse> getAll(Pageable pageable, String taskName) {
        Specification<TaskModel> spec = TaskSpecification.getSpecification(taskName);
        return PageResponse.from(taskRepo.findAll(spec, pageable).map(TaskResponse::from));
    }

    public TaskResponse getById(int taskId) {
        return TaskResponse.from(taskRepo.findById(taskId).orElseThrow(() -> new ResourceNotFound("Task with ID: " + taskId + " not found")));
    }

    public ResponseEntity<String> addTask(TaskModel taskModel) {
        taskRepo.save(taskModel);
        activityLogService.log(ActivityLogModel.Activity.CREATE, "Created a Task");
        return new ResponseEntity<>("Task added successfully!",HttpStatus.OK);
    }

    public ResponseEntity<String> deleteTask(int taskId) {
        TaskModel task = taskRepo.findById(taskId).orElseThrow(() -> new ResourceNotFound("Task with ID: " + taskId + " not found"));
        taskRepo.delete(task);
        activityLogService.log(ActivityLogModel.Activity.DELETE, "Deleted Task with ID: " + taskId);
        return new ResponseEntity<>("Task deleted successfully!",HttpStatus.OK);
    }

    public ResponseEntity<String> updateTask(int taskId, TaskUpdate taskUpdate) {
        TaskModel task = taskRepo.findById(taskId).orElseThrow(() -> new ResourceNotFound("Task with ID: " + taskId + " not found"));

        if (taskUpdate.taskName() != null) {
            task.setTaskName(taskUpdate.taskName());
        }
        if (taskUpdate.taskDescription() != null) {
            task.setTaskDescription(taskUpdate.taskDescription());
        }
        if (taskUpdate.taskStatus() != null) {
            task.setTaskStatus(taskUpdate.taskStatus());
        }
        if (taskUpdate.taskLabels() != null) {
            task.setTaskLabels(taskUpdate.taskLabels());
        }
        if (taskUpdate.dueDate() != null) {
            task.setDueDate(taskUpdate.dueDate());
        }

        taskRepo.save(task);
        activityLogService.log(ActivityLogModel.Activity.UPDATE, "Updated Task with ID: " + task.getTaskId());
        return new ResponseEntity<>("Task updated successfully!", HttpStatus.OK);
    }
}
