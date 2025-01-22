import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { CacheService } from '../services/cache/cache.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const cache = inject(CacheService);
  const router = inject(Router);

  const token = cache.getItem<string>('token');
  if (authService.isLoggedIn && token && !authService.isTokenExpired(token)) {
    return true;
  }
  router.navigate(['/login'], { queryParams: { redirectUrl: state.url } });
  return false;
};
