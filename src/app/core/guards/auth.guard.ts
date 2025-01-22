import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Role } from '../services/auth/models/auth';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenValid()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = authService.decodeToken();
    const requiredRoles = (route.data['roles'] as Role[]) ?? ([] as Role[]);

    if (requiredRoles.length === 0) {
      return true;
    }

    if (requiredRoles.some((role) => user.roles?.includes(role))) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  } else {
    authService.logout();
    router.navigate(['/login'], { queryParams: { redirectUrl: state.url } });
    return false;
  }
};
