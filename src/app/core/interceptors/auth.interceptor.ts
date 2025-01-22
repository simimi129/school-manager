import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { CacheService } from '../services/cache/cache.service';
import { AuthService } from '../services/auth/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const cache = inject(CacheService);
  const authService = inject(AuthService);

  const token = cache.getItem<string>('token');
  if (token && authService.isTokenExpired(token)) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  } else {
    authService.logout();
  }

  return next(req);
};
