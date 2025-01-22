import { inject, Injectable } from '@angular/core';
import { CacheService } from '../cache/cache.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly cache = inject(CacheService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  constructor() {
    if (this.isTokenValid()) {
      // TODO: set user
    } else {
      this.logout();
    }

    setInterval(() => {
      this.logoutIfTokenExpired();
    }, 60000);
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post<string>(`/login`, { email, password }).pipe(
      tap((token) => {
        this.cache.setItem('token', token);
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

  logoutIfTokenExpired() {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      this.logout();
    }
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

  private decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }
}
