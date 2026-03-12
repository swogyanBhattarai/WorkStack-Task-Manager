package com.justdeepfried.WorkStack.repository;

import com.justdeepfried.WorkStack.model.ActivityLogModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepo extends JpaRepository<ActivityLogModel, Integer>, JpaSpecificationExecutor<ActivityLogModel> {
}
