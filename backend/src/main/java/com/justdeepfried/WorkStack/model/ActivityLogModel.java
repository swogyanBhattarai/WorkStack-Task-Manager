package com.justdeepfried.WorkStack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Setter
@Getter
public class ActivityLogModel {

    public enum Activity {
        READ,
        CREATE,
        UPDATE,
        DELETE,
        LOGIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int activityId;

    @Enumerated(value = EnumType.STRING)
    @NotNull(message = "Activity must not be null")
    private Activity activity;

    @Column(length = 1000)
    private String activityDescription;

    @CreatedDate
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;

}
