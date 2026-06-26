package com.taskflow.repository;

import com.taskflow.model.Task;
import com.taskflow.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {

    @Query("SELECT t FROM Task t JOIN FETCH t.assignedTo WHERE " +
           "(:assignedToEmail IS NULL OR t.assignedTo.email = :assignedToEmail) AND " +
           "(:title IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:status IS NULL OR t.status = :status) " +
           "ORDER BY t.id ASC")
    List<Task> searchTasks(
            @Param("assignedToEmail") String assignedToEmail,
            @Param("title") String title,
            @Param("status") TaskStatus status
    );
}
