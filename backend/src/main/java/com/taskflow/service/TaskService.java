package com.taskflow.service;

import com.taskflow.dto.TaskDto;
import com.taskflow.model.Task;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.User;
import com.taskflow.model.UserRole;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TaskDto> getTasks(String currentUserEmail, String currentUserRole, String title, String statusStr) {
        TaskStatus status = null;
        if (statusStr != null && !statusStr.trim().isEmpty()) {
            try {
                status = TaskStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status filter. Must be TODO, IN_PROGRESS, or DONE");
            }
        }

        String searchEmail = null;

        if (UserRole.USER.name().equals(currentUserRole)) {
            searchEmail = currentUserEmail;
        }


        return taskRepository.searchTasks(searchEmail, title, status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDto createTask(TaskDto dto, String currentUserRole) {
        if (!UserRole.ADMIN.name().equals(currentUserRole)) {
            throw new AccessDeniedException("Only ADMIN can create tasks");
        }

        User assignedTo = userRepository.findById(dto.getAssignedToEmail())
                .orElseThrow(() -> new IllegalArgumentException("Assigned user does not exist"));

        TaskStatus initialStatus = TaskStatus.TODO;
        if (dto.getStatus() != null) {
            try {
                initialStatus = TaskStatus.valueOf(dto.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status. Must be TODO, IN_PROGRESS, or DONE");
            }
        }

        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(initialStatus)
                .assignedTo(assignedTo)
                .build();

        return convertToDto(taskRepository.save(task));
    }

    @Transactional
    public TaskDto updateTask(Integer taskId, TaskDto dto, String currentUserEmail, String currentUserRole) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (UserRole.ADMIN.name().equals(currentUserRole)) {

            if (dto.getTitle() != null) {
                if (dto.getTitle().trim().length() < 5) {
                    throw new IllegalArgumentException("Title must be at least 5 characters long");
                }
                task.setTitle(dto.getTitle());
            }
            task.setDescription(dto.getDescription());
            if (dto.getStatus() != null) {
                task.setStatus(TaskStatus.valueOf(dto.getStatus().toUpperCase()));
            }
            if (dto.getAssignedToEmail() != null) {
                User assignedTo = userRepository.findById(dto.getAssignedToEmail())
                        .orElseThrow(() -> new IllegalArgumentException("Assigned user does not exist"));
                task.setAssignedTo(assignedTo);
            }
        } else {

            if (!task.getAssignedTo().getEmail().equals(currentUserEmail)) {
                throw new AccessDeniedException("You are not authorized to update this task");
            }
            if (dto.getStatus() == null) {
                throw new IllegalArgumentException("Status is required for update");
            }
            try {
                task.setStatus(TaskStatus.valueOf(dto.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status. Must be TODO, IN_PROGRESS, or DONE");
            }
        }

        return convertToDto(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Integer taskId, String currentUserRole) {
        if (!UserRole.ADMIN.name().equals(currentUserRole)) {
            throw new AccessDeniedException("Only ADMIN can delete tasks");
        }
        if (!taskRepository.existsById(taskId)) {
            throw new IllegalArgumentException("Task not found");
        }
        taskRepository.deleteById(taskId);
    }

    private TaskDto convertToDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .assignedToEmail(task.getAssignedTo().getEmail())
                .createdAt(task.getCreatedAt())
                .build();
    }
}
