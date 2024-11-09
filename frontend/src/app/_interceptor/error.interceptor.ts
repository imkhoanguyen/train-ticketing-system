import { HttpInterceptorFn } from '@angular/common/http';
import { ToastrService } from '../_services/toastr.service';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 400:
            toastr.error(error.status + ' - ' + error.error.message);
            break;
          case 401:
            toastr.error('401' + ' - ' + 'Unauthorised');
            break;
          case 404:
            toastr.error(error.status + ' - ' + error.error.message);
            break;
          case 500:
            toastr.error(error.status + ' - ' + error.error.message);
            break;
          default:
            toastr.error('Something unexpected went wrong');
            break;
        }
      }
      throw error;
    })
  );
};
