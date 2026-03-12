package com.justdeepfried.WorkStack.controller;

import com.justdeepfried.WorkStack.dto.Activity.ActivityResponse;
import com.justdeepfried.WorkStack.dto.PageResponse;
import com.justdeepfried.WorkStack.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/log")
public class ActivityLogController {

    @Autowired
    private ActivityLogService activityLogService;

    @GetMapping
    public PageResponse<ActivityResponse> getAll(
            @RequestParam(required = false, defaultValue = "1") int pageNum,
            @RequestParam(required = false, defaultValue = "5") int pageSize,
            @RequestParam(required = false, defaultValue = "activityId") String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortDir,
            @RequestParam(required = false) String userSearch,
            @RequestParam(required = false) String activitySearch
    ) {
        Sort sort = null;
        if (sortDir.equalsIgnoreCase("ASC")) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        if (userSearch != null || activitySearch != null) {
            return activityLogService.getAll(PageRequest.of(pageNum - 1, pageSize, sort), userSearch, activitySearch);
        } else {
            return activityLogService.getAll(PageRequest.of(pageNum - 1, pageSize, sort));
        }
    }
}
