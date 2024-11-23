package com.example.train.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Autowired
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // Upload ảnh
    public Map<String, Object> uploadImage(MultipartFile multipartFile) {
        try {
            // Tạo tệp tạm thời từ MultipartFile
            File file = File.createTempFile("upload-", multipartFile.getOriginalFilename());
            multipartFile.transferTo(file);

            // Upload ảnh lên Cloudinary
            Map<String, Object> result = cloudinary.uploader().upload(file, ObjectUtils.asMap(
                    "resource_type", "auto" // Đảm bảo Cloudinary nhận diện loại tài nguyên tự động (ảnh, video, v.v.)
            ));

            // Xóa tệp tạm thời
            file.delete();

            return result;
        } catch (IOException e) {
            // Log chi tiết lỗi để debug
            throw new RuntimeException("Upload failed: " + e.getMessage(), e);
        }
    }

    // Xóa ảnh
    public Map<String, Object> deleteImage(String publicId) {
        try {
            return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            // Log chi tiết lỗi khi xóa ảnh
            throw new RuntimeException("Delete failed: " + e.getMessage(), e);
        }
    }

    // Check if image exists
    // public boolean checkIfImageExists(String publicId) {
    //     try {
    //         // Try to retrieve the resource by publicId
    //         Map<String, Object> result = cloudinary.api().resource(publicId, ObjectUtils.emptyMap());

    //         // If the result is not null, it means the image exists
    //         return result != null && result.containsKey("public_id");
    //     } catch (Exception e) {
    //         // If an exception occurs, it means the image doesn't exist
    //         return false;
    //     }
    // }
    public boolean checkIfImageExists(String publicId) {
        try {
            // Try to retrieve the resource by publicId
            Map<String, Object> result = cloudinary.api().resource(publicId, ObjectUtils.emptyMap());

            // Log the result to check what Cloudinary is returning
            System.out.println("Cloudinary resource check result: " + result);

            // If the result contains the public_id, it means the image exists
            return result != null && result.containsKey("public_id");
        } catch (Exception e) {
            // Log the exception details to understand what went wrong
            System.out.println("Error occurred while checking image existence: " + e.getMessage());
            return false;
        }
    }
}
