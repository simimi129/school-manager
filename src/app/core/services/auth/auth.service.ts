import { inject, Injectable } from '@angular/core';
import { CacheService } from '../cache/cache.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly cache = inject(CacheService);
  private readonly http = inject(HttpClient);

  constructor() {
    const token = this.cache.getItem<string>('token');
    if (token && !this.isTokenExpired(token)) {
      // TODO: set user
    } else {
      this.logout();
    }

    setInterval(() => {
      const token = localStorage.getItem('token');
      if (token && this.isTokenExpired(token)) {
        this.logout();
      }
    }, 60000);
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post<string>(`/login`, { email, password }).pipe(
      tap((token) => {
        console.log(token);
        console.log(this.decodeToken(token));
        this.cache.setItem('token', token);
      }),
      catchError((error) => {
        console.log(error);
        if (error.status === 401) {
          console.error('Aurhentication failed: Invalid credentials');
        } else {
          console.error('An unexpected error has occured: ', error);
        }
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  get isLoggedIn(): boolean {
    return Boolean(this.cache.getItem<string>('token'));
  }

  // TODO: figure out where to use these 2 methods
  private decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }

  public isTokenExpired(token: string): boolean {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  }
}
