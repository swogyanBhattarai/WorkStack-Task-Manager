package com.justdeepfried.WorkStack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Setter
@Getter
public class TaskModel {

    public enum TaskStatus {
        COMPLETED,
        ONGOING
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int taskId;

    @NotNull(message = "Task name must not be null.")
    @NotBlank(message = "Task name must not be blank.")
    private String taskName;

    @Column(length = 2000)
    @NotNull(message = "Task description must not be null.")
    private String taskDescription;

    @Enumerated(value = EnumType.STRING)
    private TaskStatus taskStatus;

    @NotNull(message = "Due date must not be null.")
    @NotBlank(message = "Due date must not be blank.")
    private String dueDate;

    @ElementCollection
    @CollectionTable(
            name = "task_labels",
            joinColumns = @JoinColumn(name = "task_id")
    )
    @Column(name = "task_labels")
    private List<String> taskLabels;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private ProjectModel project;
}
