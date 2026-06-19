package com.example.backend.service;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.entity.User;
import com.example.backend.exception.ApiException;
import com.example.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        String role = user.getRole().toUpperCase();
        String token = jwtService.generateToken(user.getUsername(), role);

        return new LoginResponse(
                "Login successful",
                user.getUsername(),
                role,
                token
        );
    }
}
