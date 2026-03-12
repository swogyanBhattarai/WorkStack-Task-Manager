package com.justdeepfried.WorkStack.specification;

import com.justdeepfried.WorkStack.model.UserModel;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {
    public static Specification<UserModel> getSpecification(String search) {
        return new Specification<UserModel>() {
            @Override
            public @Nullable Predicate toPredicate(Root<UserModel> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> lists = new ArrayList<>();

                if (search != null) {
                    lists.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), "%"+search.toLowerCase()+"%"));
                }

                return criteriaBuilder.or(lists.toArray(new Predicate[0]));
            }
        };
    }
}
