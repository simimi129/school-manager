import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenValid()) {
    return true;
  } else {
    authService.logout();
    router.navigate(['/login'], { queryParams: { redirectUrl: state.url } });
    return false;
  }
};
