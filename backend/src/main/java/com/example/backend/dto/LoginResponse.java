package com.example.backend.dto;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String message;
    private String username;
    private String role;
    private String token;
    
}
