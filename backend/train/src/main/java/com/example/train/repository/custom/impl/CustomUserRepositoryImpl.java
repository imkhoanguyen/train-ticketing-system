package com.example.train.repository.custom.impl;

import com.example.train.dto.response.PageResponse;
import com.example.train.dto.response.UserResponse;
import com.example.train.entity.User;
import com.example.train.repository.custom.CustomUserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.stream.Collectors;

public class CustomUserRepositoryImpl implements CustomUserRepository {
    @PersistenceContext
    private EntityManager entityManager;


    @Override
    public PageResponse<List<UserResponse>> findAllWithCustomQuery(int pageNo, int pageSize, String search, String sortBy) {
        if (pageNo < 1) {
            pageNo = 1;
        }

        // Câu lệnh cơ bản cho truy vấn
        String baseQuery = "SELECT u FROM User u WHERE u.isDelete = false ";

        if (search != null && !search.isEmpty()) {
            baseQuery += "AND (LOWER(u.cmnd) LIKE LOWER(:search) " +
                    "OR LOWER(u.phone) LIKE LOWER(:search) " +
                    "OR LOWER(u.fullName) LIKE LOWER(:search) " +
                    "OR LOWER(u.userName) LIKE LOWER(:search) " +
                    "OR LOWER(u.email) LIKE LOWER(:search)) ";
        }

        // Xử lý sắp xếp
        String sortField = sortBy != null && sortBy.contains(",") ? sortBy.split(",")[0] : sortBy;
        String sortDirection = sortBy != null && sortBy.endsWith("desc") ? "desc" : "asc";
        if (sortField != null && !sortField.isEmpty()) {
            baseQuery += "ORDER BY u." + sortField + " " + sortDirection;
        }

        // Tạo truy vấn
        TypedQuery<User> query = entityManager.createQuery(baseQuery, User.class);

        // Gán tham số tìm kiếm
        if (search != null && !search.isEmpty()) {
            query.setParameter("search", "%" + search + "%");
        }

        // Tính tổng số phần tử
        long totalElements = query.getResultList().size();

        // Phân trang
        query.setFirstResult((pageNo - 1) * pageSize);  // Tính toán phân trang với pageNo bắt đầu từ 1
        query.setMaxResults(pageSize);

        // Lấy dữ liệu
        List<UserResponse> items = query.getResultList().stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .userName(user.getUserName())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .cmnd(user.getCmnd())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList());

        return PageResponse.<List<UserResponse>>builder()
                .page(pageNo)  // Giữ lại pageNo bắt đầu từ 1
                .size(pageSize)
                .total(totalElements)
                .items(items)
                .build();
    }


}
