package com.example.backend.entity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Integer id;

private String username;
private String password;
private String role;
    
}
