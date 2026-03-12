package com.justdeepfried.WorkStack.repository;

import com.justdeepfried.WorkStack.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserRepo extends JpaRepository<UserModel, Integer>, JpaSpecificationExecutor<UserModel> {
    UserModel findByUsername(String username);
}
