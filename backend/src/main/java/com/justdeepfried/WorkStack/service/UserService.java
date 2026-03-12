package com.justdeepfried.WorkStack.service;

import com.justdeepfried.WorkStack.auth.JwtService;
import com.justdeepfried.WorkStack.dto.PageResponse;
import com.justdeepfried.WorkStack.dto.User.UserResponse;
import com.justdeepfried.WorkStack.dto.User.UserUpdate;
import com.justdeepfried.WorkStack.exception.ResourceNotFound;
import com.justdeepfried.WorkStack.model.ActivityLogModel;
import com.justdeepfried.WorkStack.model.ProjectModel;
import com.justdeepfried.WorkStack.model.UserModel;
import com.justdeepfried.WorkStack.repository.ProjectRepo;
import com.justdeepfried.WorkStack.repository.UserRepo;
import com.justdeepfried.WorkStack.specification.UserSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private AuthenticationManager auth;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ProjectRepo projectRepo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public PageResponse<UserResponse> getAll(Pageable pageable) {
        return PageResponse.from(repo.findAll(pageable).map(UserResponse::from));
    }

    public PageResponse<UserResponse> getAll(Pageable pageable, String search) {
        Specification<UserModel> spec = UserSpecification.getSpecification(search);
        return PageResponse.from(repo.findAll(spec, pageable).map(UserResponse::from));
    }

    public ResponseEntity<String> addUser(UserModel user) {
        activityLogService.log(ActivityLogModel.Activity.CREATE, "Created user: " + user.getUsername());
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return new ResponseEntity<>("User saved successfully!", HttpStatus.OK);
    }

    public UserModel getById(int id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFound("User with id: " + id + " not found!"));
    }

    public ResponseEntity<String> deleteUser(int id) {
        UserModel user = repo.findById(id).orElseThrow(() -> new ResourceNotFound("User with id: " + id + " not found!"));

        List<ProjectModel> userProjects = new ArrayList<>(user.getProjects());

        userProjects.forEach(
                project -> {
                    project.getUsers().remove(user);
                }
        );

        repo.delete(user);
        activityLogService.log(ActivityLogModel.Activity.DELETE, "Deleted user: " + user.getUsername() + " with ID: " + user.getId());
        return new ResponseEntity<>("User with id: " + id + " deleted successfully!", HttpStatus.OK);
    }

    public ResponseEntity<String> updateUser(int userId, UserUpdate userUpdate) {
        UserModel user = repo.findById(userId).orElseThrow(() -> new ResourceNotFound("User with id: " + userId + " not found!"));

        if (userUpdate.username() != null) {
            user.setUsername(userUpdate.username());
        }

        if (userUpdate.roles() != null) {
            user.setRoles(new ArrayList<>(userUpdate.roles()));
        }

        if (userUpdate.projectIds() != null) {
            List<ProjectModel> projects = projectRepo.findAllById(userUpdate.projectIds());
            projects.forEach(project -> {
                if (!project.getUsers().contains(user)) {
                    project.getUsers().add(user);
                }
            });
        }

        repo.save(user);
        activityLogService.log(ActivityLogModel.Activity.CREATE, "User with id: " + userId + " updated");
        return new ResponseEntity<>("User updated successfully!", HttpStatus.OK);
    }

    public String login(UserModel user) {
        Authentication authentication = auth.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            activityLogService.log(ActivityLogModel.Activity.LOGIN, user.getUsername() + " logged in.", user.getUsername());
            return jwtService.createToken(user.getUsername());
        }
        return "Failed";
    }

}
