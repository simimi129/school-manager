import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { CacheService } from '../../cache/cache.service';
import { ILoginResponse } from '../models/auth';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const cache = inject(CacheService);
  const currentUser = cache.getItem<ILoginResponse>('currentUser');
  if (currentUser && currentUser.token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${currentUser.token}` },
    });
  }
  return next(req);
};
