package com.example.train.services.implement;

import com.example.train.dto.request.LoginRequestDto;
import com.example.train.dto.request.RegisterRequestDto;
import com.example.train.dto.response.UserDetailResponse;
import com.example.train.entity.User;
import com.example.train.exception.BadRequestException;
import com.example.train.exception.NotFoundException;
import com.example.train.repository.UserRepository;
import com.example.train.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

//định nghĩa tầng service
@Service
// khởi tạo bean UserRepository
@RequiredArgsConstructor
public class UserServicesImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public int addUser(User user) {
        return 0;
    }

    @Override
    public void updateUser(int userId, User user) {

    }

    @Override
    public void deleteUser(int userId) {

    }

    @Override
    public List<UserDetailResponse> getAll(int pageNumber, int pageSize) {
        int p = 0;
        if(pageNumber > 0) {
            p = pageNumber - 1;
        }

        Page<User> users = userRepository.findAll(PageRequest.of(p, pageSize));


        return users.stream()
                .map(user -> UserDetailResponse.builder()
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .phone(user.getPhone())
                        .build()
                ).toList();
    }

    @Override
    public UserDetailResponse getUser(int userId) {
        return null;
    }

    @Override
    public UserDetailResponse login(LoginRequestDto dto) {
        User u = userRepository.findByUsername(dto.getUserName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if(passwordEncoder.matches(dto.getPassword(), u.getPassword())) {
            return UserDetailResponse.builder()
                    .id(u.getId())
                    .username(u.getUsername())
                    .email(u.getEmail())
                    .cmnd(u.getCmnd())
                    .phone(u.getPhone())
                    .fullName(u.getFullName())
                    .role(u.getRole())
                    .build();
        }
        throw new BadRequestException("Wrong password");
    }

    @Override
    public UserDetailResponse register(RegisterRequestDto dto) {
        Optional<User> u = userRepository.findByUsername(dto.getUserName());

        if(u.isPresent()) {
            throw new BadRequestException("Username is already in use");
        }

        User user = new User();
        user.setUsername(dto.getUserName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setRole("Customer");
        user.setCmnd(dto.getCmnd());
        userRepository.save(user);

        return UserDetailResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .cmnd(user.getCmnd())
                .phone(user.getPhone())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
