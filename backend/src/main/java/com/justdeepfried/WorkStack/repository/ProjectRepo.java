package com.justdeepfried.WorkStack.repository;

import com.justdeepfried.WorkStack.model.ProjectModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepo extends JpaRepository<ProjectModel, Integer>, JpaSpecificationExecutor<ProjectModel> {
}
