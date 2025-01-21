import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { CacheService } from '../services/cache/cache.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const cache = inject(CacheService);

  const token = cache.getItem<string>('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};
