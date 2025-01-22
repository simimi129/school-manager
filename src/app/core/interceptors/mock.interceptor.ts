import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, delay, from, map, mergeMap, of, throwError } from 'rxjs';
import { Role } from '../services/auth/models/auth';
import { jwtVerify, SignJWT } from 'jose';

// TODO: where is it by best practice?
const SECRET_KEY = new TextEncoder().encode('mock-secret-key');

export const MockInterceptor: HttpInterceptorFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (req.url.endsWith('/login') && req.method === 'POST') {
    if (req.body.email === 'test@test.com' && req.body.password === 'test') {
      const tokenPromise = new SignJWT({ userId: '123', roles: [Role.ADMIN] })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(SECRET_KEY);

      const refershTokenPromise = new SignJWT({ type: 'refresh' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET_KEY);

      return from(Promise.all([tokenPromise, refershTokenPromise])).pipe(
        mergeMap(([token, refreshToken]) => {
          return of(
            new HttpResponse({
              status: 200,
              body: { token, refreshToken },
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
  } else if (req.url.endsWith('/refresh') && req.method === 'POST') {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            error: { message: 'No refresh token provided' },
          })
      ).pipe(delay(500));
    }

    return from(jwtVerify(refreshToken, SECRET_KEY)).pipe(
      mergeMap(() => {
        const newAccessTokenPromise = new SignJWT({
          username: 'test',
          roles: ['admin', 'user'],
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('1h')
          .sign(SECRET_KEY);

        const newRefreshTokenPromise = new SignJWT({ type: 'refresh' })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('7d')
          .sign(SECRET_KEY);

        return from(
          Promise.all([newAccessTokenPromise, newRefreshTokenPromise])
        ).pipe(
          mergeMap(([newAccessToken, newRefreshToken]) => {
            return of(
              new HttpResponse({
                status: 200,
                body: { token: newAccessToken, refreshToken: newRefreshToken },
              })
            ).pipe(delay(500));
          })
        );
      }),
      catchError(() => {
        return throwError(
          () =>
            new HttpErrorResponse({
              status: 401,
              statusText: 'Unauthorized',
              error: { message: 'Invalid or expired refresh token' },
            })
        ).pipe(delay(500));
      })
    );
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
