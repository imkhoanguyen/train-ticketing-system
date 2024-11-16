package com.example.train.config;

import com.example.train.entity.User;
import com.example.train.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@RequiredArgsConstructor
@Configuration
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedData(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = new User();
                user.setUserName("admin");
                user.setPassword(passwordEncoder.encode("Admin_123"));
                user.setEmail("khoasgu01@gmail.com");
                user.setFullName("nguyen anh khoa");
                user.setPhone("0855765900");
                user.setRole("Admin");
                user.setCmnd("855765900");
                userRepository.save(user);

                User user1 = new User();
                user1.setUserName("customer");
                user1.setPassword(passwordEncoder.encode("Customer_123"));
                user1.setEmail("itk21sgu@gmail.com");
                user1.setFullName("nguyen van a");
                user1.setPhone("0147258369");
                user1.setRole("Customer");
                user1.setCmnd("147258369");
                userRepository.save(user1);
            }
        };
    }
}
