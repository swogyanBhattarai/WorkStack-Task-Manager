package com.justdeepfried.WorkStack.specification;

import com.justdeepfried.WorkStack.model.TaskModel;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TaskSpecification {
    public static Specification<TaskModel> getSpecification(String taskName) {
        return new Specification<TaskModel>() {
            @Override
            public @Nullable Predicate toPredicate(Root<TaskModel> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

                List<Predicate> lists = new ArrayList<>();

                if (taskName != null) {
                    lists.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("taskName")), "%"+taskName.toLowerCase()+"%"));
                }

                return criteriaBuilder.or(lists.toArray(new Predicate[0]));
            }
        };
    }
}
