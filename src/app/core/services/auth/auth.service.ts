import { inject, Injectable } from '@angular/core';
import { CacheService } from '../cache/cache.service';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Router } from '@angular/router';
import { IAuthStatus, ITokens } from './models/auth';
import { AuthHttpService } from './http/auth-http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly cache = inject(CacheService);
  private readonly router = inject(Router);
  private readonly authHttpService = inject(AuthHttpService);

  private authStatus = new BehaviorSubject<IAuthStatus>({} as IAuthStatus);
  readonly authStatus$ = this.authStatus.asObservable();

  constructor() {
    const jwt = this.getToken();

    if (this.isTokenValid()) {
      if (jwt) {
        this.scheduleTokenRefresh(jwt);
        const { userId, roles } = this.decodeToken(jwt) as IAuthStatus;
        this.authStatus.next({
          userId,
          roles,
        } as IAuthStatus);
      }
    } else {
      this.refreshToken().subscribe();
    }
  }

  login(email: string, password: string): Observable<ITokens> {
    return this.authHttpService.login(email, password).pipe(
      tap((res) => {
        this.cache.setItem('token', res.token);
        this.cache.setItem('refreshToken', res.refreshToken);
      }),
      catchError((error) => {
        if (error.status === 401) {
          console.error('Aurhentication failed: Invalid credentials');
        } else {
          console.error('An unexpected error has occured: ', error);
        }
        return throwError(() => error);
      })
    );
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  logout(redirectUrl?: string): void {
    const url = redirectUrl
      ? [['/login'], { queryParams: redirectUrl }]
      : ['/login'];
    this.cache.removeItem('token');
    this.cache.removeItem('refreshToken');
    this.authStatus.next({} as IAuthStatus);
    // TODO: reset user
    this.router.navigate(url);
  }

  getToken() {
    return this.cache.getItem<string>('token');
  }

  private isTokenExpired(token: string): boolean {
    const { exp } = this.decodeToken(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  }

  public decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token found'));
    }

    return this.authHttpService.refreshToken(refreshToken).pipe(
      map((res) => {
        const { token, refreshToken: newRefreshToken } = res;
        this.cache.setItem('token', token);
        this.cache.setItem('refreshToken', newRefreshToken);
        return res;
      }),
      catchError((error) => {
        console.error('Failed to refresh token: ', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  getRefreshToken() {
    return this.cache.getItem<string>('refreshToken');
  }

  scheduleTokenRefresh(token: string): void {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (exp) {
      const expirationTime = exp * 1000 - Date.now();
      const refreshTime = expirationTime - 60000;
      setTimeout(() => this.refreshToken(), Math.max(refreshTime, 0));
    }
  }
}
