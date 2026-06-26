package com.taskflow.controller;

import com.taskflow.dto.TaskDto;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDto>> getTasks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status,
            Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        String role = getRole(authentication);
        return ResponseEntity.ok(taskService.getTasks(email, role, title, status));
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody TaskDto dto, Authentication authentication) {
        String role = getRole(authentication);
        return ResponseEntity.ok(taskService.createTask(dto, role));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable Integer id,
            @RequestBody TaskDto dto,
            Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        String role = getRole(authentication);
        return ResponseEntity.ok(taskService.updateTask(id, dto, email, role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer id, Authentication authentication) {
        String role = getRole(authentication);
        taskService.deleteTask(id, role);
        return ResponseEntity.noContent().build();
    }

    private String getRole(Authentication authentication) {

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.replace("ROLE_", ""))
                .findFirst()
                .orElse("USER");
    }
}
