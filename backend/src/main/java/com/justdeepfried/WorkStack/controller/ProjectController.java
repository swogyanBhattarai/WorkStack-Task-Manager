package com.justdeepfried.WorkStack.controller;

import com.justdeepfried.WorkStack.dto.PageResponse;
import com.justdeepfried.WorkStack.dto.Project.ProjectResponse;
import com.justdeepfried.WorkStack.dto.Project.ProjectUpdate;
import com.justdeepfried.WorkStack.model.ProjectModel;
import com.justdeepfried.WorkStack.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/project")
public class ProjectController {

    @Autowired
    private ProjectService service;

    @GetMapping
    public PageResponse<ProjectResponse> getAll(
            @RequestParam(required = false, defaultValue = "1") int pageNum,
            @RequestParam(required = false, defaultValue = "5") int pageSize,
            @RequestParam(required = false, defaultValue = "projectId") String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortDir,
            @RequestParam(required = false) String projectSearch,
            @RequestParam(required = false) String statusSearch
    ) {
        Sort sort = null;
        if (sortDir.equalsIgnoreCase("ASC")) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        if (projectSearch != null || statusSearch != null) {
            return service.getAll(PageRequest.of(pageNum - 1, pageSize, sort), projectSearch, statusSearch);
        } else {
            return service.getAll(PageRequest.of(pageNum - 1, pageSize, sort));
        }
    }

    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable int id) {
        return service.getById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addProject(@RequestBody ProjectModel project) {
        return service.addProject(project);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateProject(@PathVariable int id, @RequestBody ProjectUpdate update) {
        return service.updateProject(id, update);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable int id) {
        return service.deleteProject(id);
    }


}
