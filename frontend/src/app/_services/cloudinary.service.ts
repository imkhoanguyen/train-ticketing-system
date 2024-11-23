import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private http = inject(HttpClient); 
  private baseUrl = environment.apiUrl;

    uploadImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'trainImage'); // Thay thế bằng upload preset của bạn

        return this.http.post(`${this.baseUrl}/images/upload`, formData);
    }

    checkImageExists(publicId: string): Observable<any> {
        // Replace the URL below with the Cloudinary API endpoint for checking resources by public ID
        return this.http.get(`${this.baseUrl}/images/exists/${publicId}`);
      }

    // Phương thức xóa hình ảnh từ Cloudinary
    deleteImage(publicId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/images/delete/${publicId}`);  // Gọi API xóa ở backend
    }
}
