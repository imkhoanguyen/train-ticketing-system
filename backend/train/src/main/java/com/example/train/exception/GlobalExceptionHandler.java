package com.example.train.exception;

import com.example.train.dto.response.ResponseData;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle MethodArgumentNotValidException (Lỗi validation từ BindingResult) thường ở controller
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseData<List<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errors = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.add(error.getDefaultMessage())); // Thêm thông báo lỗi vào list

        return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Validation failed", errors);
    }

    // giống hàm handleValidationExceptions nhưng ở những nơi khác ko phải controller
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseData<List<String>> handleConstraintViolationExceptions(ConstraintViolationException ex) {
        List<String> errors = new ArrayList<>();

        // Lặp qua các vi phạm (violations) và lấy thông báo lỗi
        ex.getConstraintViolations().forEach(violation -> {
            errors.add(violation.getMessage());  // Thêm thông báo lỗi vào danh sách
        });

        return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Validation failed", errors);
    }

    // Handle các ngoại lệ chung khác (ví dụ: lỗi cơ sở dữ liệu, lỗi không xác định, v.v.)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseData<String>> handleGeneralExceptions(Exception ex) {
        HttpStatus status;

        // Tùy chỉnh mã trạng thái theo loại ngoại lệ
        if (ex instanceof IllegalArgumentException) {
            status = HttpStatus.BAD_REQUEST;
        } else if (ex instanceof IllegalStateException) {
            status = HttpStatus.CONFLICT;
        } else if (ex instanceof EntityNotFoundException || ex instanceof NoSuchElementException) {
            status = HttpStatus.NOT_FOUND;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        ResponseData<String> response = new ResponseData<>(status.value(), "An error occurred", ex.getMessage());
        return new ResponseEntity<>(response, status);
    }




}