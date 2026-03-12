package com.justdeepfried.WorkStack.specification;

import com.justdeepfried.WorkStack.model.ProjectModel;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProjectSpecification {
    public static Specification<ProjectModel> getSpecification(String projectSearch, String statusSearch) {
        return new Specification<ProjectModel>() {
            @Override
            public @Nullable Predicate toPredicate(Root<ProjectModel> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> lists = new ArrayList<>();

                if (projectSearch != null) {
                    lists.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("projectName")), "%"+projectSearch.toLowerCase()+"%"));
                }

                if (statusSearch != null) {
                    ProjectModel.Status status = ProjectModel.Status.valueOf(statusSearch.toUpperCase());
                    lists.add(criteriaBuilder.equal(root.get("status"), status));
                }

                return criteriaBuilder.or(lists.toArray(new Predicate[0]));
            }
        };
    }
}
