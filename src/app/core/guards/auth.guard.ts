import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { IAuthStatus, Role } from '../services/auth/models/auth';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  if (!!token && authService.isTokenValid()) {
    const { roles } = authService.decodeToken(token) as IAuthStatus;
    const requiredRoles = (route.data['roles'] as Role[]) ?? ([] as Role[]);
    if (requiredRoles.length === 0) {
      return true;
    }
    if (requiredRoles.some((role) => roles?.includes(role))) {
      return true;
    }
    router.navigate(['/unauthorized']);
    return false;
  }
  authService.logout();
  router.navigate(['/login'], { queryParams: { redirectUrl: state.url } });
  return false;
};
