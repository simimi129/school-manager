import { inject, Injectable } from '@angular/core';
import { CacheService } from '../cache/cache.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ILoginResponse } from './models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly cache = inject(CacheService);
  private readonly http = inject(HttpClient);

  private currentUserSubject = new BehaviorSubject<ILoginResponse | null>(null);
  public currentUser$: Observable<ILoginResponse | null> =
    this.currentUserSubject.asObservable();

  constructor() {
    const user = this.cache.getItem<ILoginResponse>('currentUser');
    if (user) this.currentUserSubject.next(user);
  }

  login(username: string, password: string): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(`/login`, { username, password })
      .pipe(
        map((user) => {
          this.cache.setItem('currentUser', user);
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
