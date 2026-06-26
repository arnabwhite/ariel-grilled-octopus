package com.taskflow.controller;

import com.taskflow.model.User;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<String>> getAllUserEmails() {
        List<String> emails = userRepository.findAll().stream()
                .map(User::getEmail)
                .collect(Collectors.toList());
        return ResponseEntity.ok(emails);
    }
}
