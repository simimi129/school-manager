import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ITokens } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  private readonly http = inject(HttpClient);

  login(email: string, password: string) {
    return this.http.post<ITokens>(`/login`, {
      email,
      password,
    });
  }

  refreshToken(refreshToken: string) {
    return this.http.post<ITokens>(`/refresh`, {
      refreshToken,
    });
  }
}
