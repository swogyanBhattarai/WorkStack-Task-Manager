package com.justdeepfried.WorkStack.controller;

import com.justdeepfried.WorkStack.dto.PageResponse;
import com.justdeepfried.WorkStack.dto.User.UserResponse;
import com.justdeepfried.WorkStack.dto.User.UserUpdate;
import com.justdeepfried.WorkStack.model.UserModel;
import com.justdeepfried.WorkStack.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping
    public PageResponse<UserResponse> getAll(
            @RequestParam(required = false, defaultValue = "1") int pageNum,
            @RequestParam(required = false, defaultValue = "5") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortDir,
            @RequestParam(required = false) String search
    ) {
        Sort sort = null;
        if (sortDir.equalsIgnoreCase("ASC")) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        if (search != null) {
            return service.getAll(PageRequest.of(pageNum - 1, pageSize, sort), search);
        } else {
            return service.getAll(PageRequest.of(pageNum - 1, pageSize, sort));
        }
    }

    @GetMapping("/{id}")
    public UserModel getById(@PathVariable int id) {
        return service.getById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addUser(@RequestBody @Valid UserModel user) {
        return service.addUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody UserModel user) {
        return service.login(user);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        return service.deleteUser(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateUser(@PathVariable int id, @RequestBody UserUpdate update) {
        return service.updateUser(id, update);
    }
}
