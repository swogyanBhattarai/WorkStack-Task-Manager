package com.justdeepfried.WorkStack.service;

import com.justdeepfried.WorkStack.dto.PageResponse;
import com.justdeepfried.WorkStack.dto.Project.ProjectResponse;
import com.justdeepfried.WorkStack.dto.Project.ProjectUpdate;
import com.justdeepfried.WorkStack.exception.ResourceNotFound;
import com.justdeepfried.WorkStack.model.ActivityLogModel;
import com.justdeepfried.WorkStack.model.ProjectModel;
import com.justdeepfried.WorkStack.model.TaskModel;
import com.justdeepfried.WorkStack.model.UserModel;
import com.justdeepfried.WorkStack.repository.ProjectRepo;
import com.justdeepfried.WorkStack.repository.TaskRepo;
import com.justdeepfried.WorkStack.repository.UserRepo;
import com.justdeepfried.WorkStack.specification.ProjectSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ProjectService {

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TaskRepo taskRepo;

    public PageResponse<ProjectResponse> getAll(Pageable pageable) {
        return PageResponse.from(projectRepo.findAll(pageable).map(ProjectResponse::from));
    }

    public PageResponse<ProjectResponse> getAll(Pageable pageable, String projectSearch, String statusSearch) {
        Specification<ProjectModel> spec = ProjectSpecification.getSpecification(projectSearch, statusSearch);
        return PageResponse.from(projectRepo.findAll(spec, pageable).map(ProjectResponse::from));
    }

    public ProjectResponse getById(int id) {
        return ProjectResponse.from(projectRepo.findById(id).orElseThrow(() -> new ResourceNotFound("Project with ID: " + id + " not found")));
    }

    public ResponseEntity<String> addProject(ProjectModel project) {
        activityLogService.log(ActivityLogModel.Activity.CREATE, "Created a new project.");
        projectRepo.save(project);
        return new ResponseEntity<>("Project added successfully!",HttpStatus.OK);
    }

    public ResponseEntity<String> deleteProject(int projectId) {
        ProjectModel project = projectRepo.findById(projectId).orElseThrow(() -> new ResourceNotFound("Project with ID: " + projectId + " not found"));
        activityLogService.log(ActivityLogModel.Activity.DELETE, "Deleted project with ID: " + projectId);
        projectRepo.delete(project);
        return new ResponseEntity<>("Project deleted successfully!", HttpStatus.OK);
    }

    public ResponseEntity<String> updateProject(int projectId, ProjectUpdate projectUpdate) {

        ProjectModel project = projectRepo.findById(projectId).orElseThrow(() -> new ResourceNotFound("Project with ID: " + projectId + " not found"));

        if (projectUpdate.projectName() != null) {
            project.setProjectName(projectUpdate.projectName());
        }

        if (projectUpdate.projectDescription() != null) {
            project.setDescription(projectUpdate.projectDescription());
        }

        if (projectUpdate.projectStatus() != null) {
            project.setProjectStatus(projectUpdate.projectStatus());
        }

        if (projectUpdate.userIds() != null) {
            List<UserModel> users = userRepo.findAllById(projectUpdate.userIds());
            project.setUsers(users);
        }

        if (projectUpdate.taskIds() != null) {
            List<TaskModel> existingTasks = project.getTasks();
            List<TaskModel> tasks = taskRepo.findAllById(projectUpdate.taskIds());
            existingTasks.forEach(task -> {
                if (!tasks.contains(task)) {
                    task.setProject(null);
                }
            });
            tasks.forEach(task -> {
                task.setProject(project);
            });
        }

        projectRepo.save(project);
        activityLogService.log(ActivityLogModel.Activity.UPDATE, "Updated project: " + project.getProjectName() + " with id: " + project.getProjectId());

        return new ResponseEntity<>("Updated successfully!", HttpStatus.OK);
    }

}
