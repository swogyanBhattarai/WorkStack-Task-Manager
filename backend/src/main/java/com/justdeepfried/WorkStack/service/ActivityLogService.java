package com.justdeepfried.WorkStack.service;

import com.justdeepfried.WorkStack.dto.Activity.ActivityResponse;
import com.justdeepfried.WorkStack.dto.PageResponse;
import com.justdeepfried.WorkStack.model.ActivityLogModel;
import com.justdeepfried.WorkStack.model.UserModel;
import com.justdeepfried.WorkStack.repository.ActivityLogRepo;
import com.justdeepfried.WorkStack.repository.UserRepo;
import com.justdeepfried.WorkStack.specification.ActivityLogSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ActivityLogService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ActivityLogRepo activityLogRepo;

    public void log(ActivityLogModel.Activity activity, String description) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserModel currentUser = null;
        String username = "SYSTEM";

        ActivityLogModel activityLog = new ActivityLogModel();

        if (authentication != null && authentication.isAuthenticated()) {
            username = authentication.getName();
            currentUser = userRepo.findByUsername(username);
            activityLog.setUser(currentUser);
        }

        activityLog.setActivity(activity);
        activityLog.setActivityDescription(description);
        activityLogRepo.save(activityLog);
    }

    public void log(ActivityLogModel.Activity activity, String description, String username) {
        UserModel user = userRepo.findByUsername(username);
        ActivityLogModel activityLog = new ActivityLogModel();
        activityLog.setUser(user);
        activityLog.setActivity(activity);
        activityLog.setActivityDescription(description);
        activityLogRepo.save(activityLog);
    }

    public PageResponse<ActivityResponse> getAll(Pageable pageable) {
        return PageResponse.from(activityLogRepo.findAll(pageable).map(ActivityResponse::from));
    }
    public PageResponse<ActivityResponse> getAll(Pageable pageable, String userSearch, String activitySearch) {
        Specification<ActivityLogModel> spec = ActivityLogSpecification.getSpecification(userSearch, activitySearch);
        return PageResponse.from(activityLogRepo.findAll(spec, pageable).map(ActivityResponse::from));
    }
}
