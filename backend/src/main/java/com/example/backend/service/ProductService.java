package com.example.backend.service;

import com.example.backend.entity.Product;
import com.example.backend.exception.ApiException;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repo;

    public Product addProduct(Product product) {
        return repo.save(product);
    }

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProductById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    public Product updateProduct(Integer id, Product newProduct) {

        Product oldProduct = getProductById(id);

        oldProduct.setName(newProduct.getName());
        oldProduct.setPrice(newProduct.getPrice());
        oldProduct.setCategory(newProduct.getCategory());

        return repo.save(oldProduct);
    }

    public void deleteProduct(Integer id) {

        Product product = getProductById(id);

        repo.delete(product);
    }
}
