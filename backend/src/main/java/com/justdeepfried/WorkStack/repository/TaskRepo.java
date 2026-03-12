package com.justdeepfried.WorkStack.repository;

import com.justdeepfried.WorkStack.model.TaskModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepo extends JpaRepository<TaskModel, Integer>, JpaSpecificationExecutor<TaskModel> {
}
