package com.example.train.services.implement;

import com.example.train.dto.request.LoginRequestDto;
import com.example.train.dto.request.RegisterRequestDto;
import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.UserDetailResponse;
import com.example.train.dto.response.UserResponse;
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
    public void updateUser(int userId, User user) {

    }

    @Override
    public void deleteUser(int userId) {

    }

    @Override
    public PageResponse<List<UserResponse>> getAllWithLimit(int pageNo, int pageSize, String search, String sortBy) {
        return userRepository.findAllWithCustomQuery(pageNo, pageSize, search, sortBy);
    }



    @Override
    public UserDetailResponse getUser(int userId) {
        return null;
    }

    @Override
    public UserDetailResponse login(LoginRequestDto dto) {
        User u = userRepository.findByUserName(dto.getUserName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if(passwordEncoder.matches(dto.getPassword(), u.getPassword())) {
            return UserDetailResponse.builder()
                    .id(u.getId())
                    .userName(u.getUserName())
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
        Optional<User> u = userRepository.findByUserName(dto.getUserName());

        if(u.isPresent()) {
            throw new BadRequestException("Username is already in use");
        }

        User user = new User();
        user.setUserName(dto.getUserName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setRole("Customer");
        user.setCmnd(dto.getCmnd());
        userRepository.save(user);

        return UserDetailResponse.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .cmnd(user.getCmnd())
                .phone(user.getPhone())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
