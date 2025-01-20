import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  mergeMap,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { Role } from '../models/auth.enum';
import { jwtDecode } from 'jwt-decode';
import { IUser, User } from '../../../../pages/user-profile/models/user';
import { transformError } from '../../../util/common/common';
import { inject } from '@angular/core';
import { CacheService } from '../../cache/cache.service';

export interface IAuthStatus {
  isAuthenticated: boolean;
  role: Role;
  userId: string;
}

export interface IServerAuthResponse {
  accessToken: string;
}

export const defaultAuthStatus: IAuthStatus = {
  isAuthenticated: false,
  role: Role.None,
  userId: '',
};

export interface IAuthService {
  readonly authStatus$: BehaviorSubject<IAuthStatus>;
  readonly currentUser$: BehaviorSubject<IUser>;
  login(email: string, password: string): Observable<void>;
  logout(clearToken?: boolean): void;
}

export abstract class AuthService implements IAuthService {
  protected readonly cache = inject(CacheService);

  protected abstract authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse>;
  protected abstract transformJwtToken(token: unknown): IAuthStatus;
  protected abstract getCurrentUser(): Observable<User>;

  authStatus$ = new BehaviorSubject<IAuthStatus>(
    this.cache.getItem('authStatus') ?? defaultAuthStatus
  );
  currentUser$ = new BehaviorSubject<IUser>(new User());

  constructor() {
    this.authStatus$.pipe(
      tap((authStatus) => this.cache.setItem('authStatus', authStatus))
    );
  }

  login(email: string, password: string): Observable<void> {
    const loginResponse$ = this.authProvider(email, password).pipe(
      map((value) => {
        const token = jwtDecode(value.accessToken);
        return this.transformJwtToken(token);
      }),
      tap((status) => this.authStatus$.next(status)),
      filter((status: IAuthStatus) => status.isAuthenticated),
      mergeMap(() => this.getCurrentUser()),
      map((user) => this.currentUser$.next(user)),
      catchError(transformError)
    );
    loginResponse$.subscribe({
      error: (err) => {
        this.logout();
        return throwError(err);
      },
    });
    return loginResponse$;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logout(clearToken?: boolean): void {
    setTimeout(() => this.authStatus$.next(defaultAuthStatus), 0);
  }
}
