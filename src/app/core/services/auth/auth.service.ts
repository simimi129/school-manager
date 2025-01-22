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
import { HttpClient } from '@angular/common/http';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Router } from '@angular/router';
import { IAuthStatus } from './models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly cache = inject(CacheService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private authStatus = new BehaviorSubject<IAuthStatus>({} as IAuthStatus);
  readonly authStatus$ = this.authStatus.asObservable();

  constructor() {
    if (this.isTokenValid()) {
      // TODO: set user
    } else {
      this.logout();
    }

    // setInterval(() => {
    //   this.refreshToken();
    // }, 60000);
  }

  // TODO: put http calls to http service
  login(
    email: string,
    password: string
  ): Observable<{ token: string; refreshToken: string }> {
    return this.http
      .post<{ token: string; refreshToken: string }>(`/login`, {
        email,
        password,
      })
      .pipe(
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
    // authService.authStatus.next({});
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

  // TODO: put http calls to http service
  refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token found'));
    }

    return this.http
      .post<{ token: string; refreshToken: string }>(`/refresh`, {
        refreshToken,
      })
      .pipe(
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
}
