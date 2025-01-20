import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MockInterceptor } from './shared/data-access/generic-http/interceptors/mock.interceptor';
import { provideAuthService } from './core/util/providers/auth-service.provider';
import { InMemroyAuthService } from './core/services/auth/services/in-memroy-auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([MockInterceptor])),
    provideAuthService(InMemroyAuthService),
  ],
};
