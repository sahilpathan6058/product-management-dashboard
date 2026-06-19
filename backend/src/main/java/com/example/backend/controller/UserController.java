package com.example.backend.controller;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @PostMapping({"/login", "/api/login", "/api/users/login"})
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }
    
}
