import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Role } from '../services/auth/models/auth';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  if (!!token && authService.isTokenValid()) {
    // TODO: remove next line
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = authService.decodeToken(token);
    const requiredRoles = (route.data['roles'] as Role[]) ?? ([] as Role[]);
    if (requiredRoles.length === 0) {
      return true;
    }
    if (requiredRoles.some((role) => user.roles?.includes(role))) {
      return true;
    }
    router.navigate(['/unauthorized']);
    return false;
  }
  authService.logout();
  router.navigate(['/login'], { queryParams: { redirectUrl: state.url } });
  return false;
};
