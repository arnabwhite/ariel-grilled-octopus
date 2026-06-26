package com.taskflow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test") // ponytail: separates test configuration to avoid connecting to production SQL Server during build
class ApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void generateHashes() {
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        System.out.println("=== HASH GENERATOR ===");
        System.out.println("AdminPassword123! -> " + encoder.encode("AdminPassword123!"));
        System.out.println("UserPassword123! -> " + encoder.encode("UserPassword123!"));
        System.out.println("======================");
    }
}
