import { Provider } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export function provideAuthService(authService: AuthService): Provider {
  return {
    provide: AuthService,
    useValue: authService,
  };
}
