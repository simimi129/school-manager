import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { catchError, mergeMap, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.getToken();
  if (token && authService.isTokenValid()) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${authService.getToken()}` },
    });
    return next(req);
  } else if (token) {
    return authService.refreshToken().pipe(
      mergeMap(() => {
        const newToken = authService.getToken();
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` },
        });
        return next(req);
      }),
      catchError((error) => {
        authService.logout();
        return throwError(() => error);
      })
    );
  }

  authService.logout();
  return throwError(() => new Error('No token found'));
};
