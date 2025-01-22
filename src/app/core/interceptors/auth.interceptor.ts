import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (authService.isTokenValid()) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${authService.getToken()}` },
    });
  } else {
    authService.logout();
  }

  return next(req);
};
