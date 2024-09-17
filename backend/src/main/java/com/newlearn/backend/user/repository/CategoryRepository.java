package com.newlearn.backend.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newlearn.backend.user.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

	Category findByCategoryName(String categoryName);
}
