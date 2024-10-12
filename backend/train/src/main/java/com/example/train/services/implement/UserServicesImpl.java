package com.example.train.services.implement;

import com.example.train.dto.response.UserDetailResponse;
import com.example.train.entity.User;
import com.example.train.repository.UserRepository;
import com.example.train.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
//định nghĩa tầng service
@Service
// ghi log
@Slf4j
// khởi tạo bean UserRepository
@RequiredArgsConstructor
public class UserServicesImpl implements UserService {

    private final UserRepository userRepository;

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
}
