import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { delay, from, map, mergeMap, of, throwError } from 'rxjs';
import { Role } from '../services/auth/models/auth';
import { SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode('mock-secret-key');

export const MockInterceptor: HttpInterceptorFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (req.url.endsWith('/login') && req.method === 'POST') {
    if (req.body.email === 'test@test.com' && req.body.password === 'test') {
      return from(
        new SignJWT({ userId: '123', role: Role.ADMIN })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('1h')
          .sign(SECRET_KEY)
      ).pipe(
        mergeMap((token) => {
          return of(
            new HttpResponse({
              status: 200,
              body: token,
            })
          ).pipe(delay(500));
        })
      );
    } else {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            error: { message: 'Invalid ceredentials' },
          })
      ).pipe(delay(500));
    }
  } else {
    const clonedRequest = req.clone({
      url: `assets/api${req.url.split('/api').pop()}.json`,
      method: 'GET',
    });

    return next(clonedRequest).pipe(
      map((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse && req.method !== 'GET') {
          return event.clone({ body: req.body });
        }
        return event;
      })
    );
  }
};
