package com.example.train.controller;

import com.example.train.services.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    @Autowired
    public CloudinaryController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    // Endpoint upload ảnh
    @PostMapping("/upload")
    public Map<String, Object> uploadImage(@RequestParam("file") MultipartFile multipartFile) {
        try {
            // Gọi dịch vụ để upload ảnh
            return cloudinaryService.uploadImage(multipartFile);
        } catch (RuntimeException e) {
            // Trả về thông báo lỗi chi tiết
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    // Endpoint xóa ảnh
    @DeleteMapping("/delete/{publicId}")
    public Map<String, Object> deleteImage(@PathVariable String publicId) {
        try {
            // Gọi dịch vụ để xóa ảnh
            return cloudinaryService.deleteImage(publicId);
        } catch (RuntimeException e) {
            // Trả về thông báo lỗi chi tiết
            throw new RuntimeException("Failed to delete image: " + e.getMessage());
        }
    }

    @GetMapping("/exists/{publicId}")
    public boolean checkImageExists(@PathVariable String publicId) {
        try {
            return cloudinaryService.checkIfImageExists(publicId);
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to check if image exists: " + e.getMessage());
        }
    }
}
