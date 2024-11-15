import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { inject } from '@angular/core';
import { ToastrService } from '../_services/toastr.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const currentUser = authService.getCurrentUser();
  let token = null;

  if (currentUser) {
    try {
      token = currentUser.token;
      console.log('tokenTrong jwtInterceptor', token);
    } catch (error) {
      console.error('Error parsing user data:', error);
      toastr.error('Error parsing user data');
    }
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
