import { CanActivateFn } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { inject } from '@angular/core';
import { ToastrService } from '../_services/toastr.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toasrtService = inject(ToastrService);
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    toasrtService.error('Vui lòng đăng nhập');
    return false;
  }
  const role = authService.getCurrentUser().role;
  if (role === 'Admin') {
    return true;
  }
  toasrtService.error('Bạn không có quyền truy cập trang này');
  return false;
};
