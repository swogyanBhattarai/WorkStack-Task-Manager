package com.justdeepfried.WorkStack.controller;

import com.justdeepfried.WorkStack.dto.PageResponse;
import com.justdeepfried.WorkStack.dto.Task.TaskResponse;
import com.justdeepfried.WorkStack.dto.Task.TaskUpdate;
import com.justdeepfried.WorkStack.model.TaskModel;
import com.justdeepfried.WorkStack.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public PageResponse<TaskResponse> getAll(
            @RequestParam(required = false, defaultValue = "1") int pageNum,
            @RequestParam(required = false, defaultValue = "5") int pageSize,
            @RequestParam(required = false, defaultValue = "taskId") String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortDir,
            @RequestParam(required = false) String taskName
    ) {
        Sort sort = null;

        if (sortDir.equalsIgnoreCase("ASC")) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        if (taskName != null) {
            return taskService.getAll(PageRequest.of(pageNum - 1, pageSize, sort), taskName);
        } else {
            return taskService.getAll(PageRequest.of(pageNum - 1, pageSize, sort));
        }
    }

    @GetMapping("/{id}")
    public TaskResponse getById(@PathVariable int id) {
        return taskService.getById(id);
    }

    @PostMapping
    public ResponseEntity<String> addTask(@RequestBody TaskModel task) {
        return taskService.addTask(task);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable int id) {
        return taskService.deleteTask(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTask(@PathVariable("id") int taskId, @RequestBody TaskUpdate update) {
        return taskService.updateTask(taskId, update);
    }
}
