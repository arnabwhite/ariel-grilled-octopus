package com.taskflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDto {

    private Integer id;

    @NotBlank(message = "Title is required")
    @Size(min = 5, message = "Title must be at least 5 characters long")
    private String title;

    private String description;

    private String status;
    @NotBlank(message = "Assigned user email is required")
    @Email(message = "Assigned user must be a valid email")
    private String assignedToEmail;

    private LocalDateTime createdAt;
}
