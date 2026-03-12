package com.justdeepfried.WorkStack.specification;

import com.justdeepfried.WorkStack.model.ActivityLogModel;
import com.justdeepfried.WorkStack.model.UserModel;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ActivityLogSpecification {
    public static Specification<ActivityLogModel> getSpecification(String userSearch, String activitySearch) {
        return new Specification<ActivityLogModel>() {
            @Override
            public @Nullable Predicate toPredicate(Root<ActivityLogModel> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> lists = new ArrayList<>();

                if (activitySearch != null) {
                    ActivityLogModel.Activity activity = ActivityLogModel.Activity.valueOf(activitySearch.toUpperCase());
                    lists.add(criteriaBuilder.equal(root.get("activity"), activity));
                }
                if (userSearch != null) {
                    lists.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("username")), "%"+userSearch.toLowerCase()+"%"));
                }

                return criteriaBuilder.or(lists.toArray(new Predicate[0]));
            }
        };
    }
}
