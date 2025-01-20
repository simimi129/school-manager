import { Provider } from '@angular/core';
import { AuthService } from '../../services/auth/services/auth.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function provideAuthService(authService: any): Provider {
  return {
    provide: AuthService,
    useClass: authService,
  };
}
