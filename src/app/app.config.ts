import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthConfig, provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment.development';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MockInterceptor } from './shared/data-access/generic-http/interceptors/mock.interceptor';

const authConfig: AuthConfig = {
  domain: environment.auth0.domain,
  clientId: environment.auth0.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAuth0(authConfig),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([MockInterceptor])),
  ],
};
