package com.example.backend.controller;

import com.example.backend.entity.Product;
import com.example.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/products", "/api/products"})
public class ProductController {

    @Autowired
    private ProductService service;

    @PostMapping
    public Product addProduct(@Valid @RequestBody Product product) {
        return service.addProduct(product);
    }

    @GetMapping
    public List<Product> getProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Integer id) {
        return service.getProductById(id);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Integer id,
                                 @Valid @RequestBody Product product) {
        return service.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Integer id) {
        service.deleteProduct(id);
        return "Product deleted successfully";
    }
}
