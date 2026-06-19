package com.example.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be zero or positive")
    private Double price;

    @NotBlank(message = "Category is required")
    private String category;

    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void setCreatedDate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
