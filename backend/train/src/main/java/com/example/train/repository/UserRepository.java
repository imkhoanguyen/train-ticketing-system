package com.example.train.repository;

import com.example.train.entity.Promotion;
import com.example.train.entity.User;
import com.example.train.repository.custom.CustomUserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>, CustomUserRepository {
    Optional<User> findByUserName(String userName);
}
