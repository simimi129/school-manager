import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  mergeMap,
  Observable,
  pipe,
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
  userId: string | null;
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

  private getAndUpdateUserIfAuthenticated = pipe(
    filter((status: IAuthStatus) => status.isAuthenticated),
    mergeMap(() => this.getCurrentUser()),
    map((user: IUser) => this.currentUser$.next(user)),
    catchError(transformError)
  );

  protected readonly resumeCurrentUser$ = this.authStatus$.pipe(
    this.getAndUpdateUserIfAuthenticated
  );

  constructor() {
    if (this.hasExpiredToken()) {
      this.logout(true);
    } else {
      this.authStatus$.next(this.getAuthStatusFromToken());
      setTimeout(() => this.resumeCurrentUser$.subscribe(), 0);
    }
    this.authStatus$.pipe(
      tap((authStatus) => this.cache.setItem('authStatus', authStatus))
    );
  }

  login(email: string, password: string): Observable<void> {
    this.clearToken();
    const loginResponse$ = this.authProvider(email, password).pipe(
      map((value) => {
        this.setToken(value.accessToken);
        return this.getAuthStatusFromToken();
      }),
      tap((status) => this.authStatus$.next(status)),
      this.getAndUpdateUserIfAuthenticated
    );
    loginResponse$.subscribe({
      error: (err) => {
        this.logout();
        return throwError(err);
      },
    });
    return loginResponse$;
  }

  logout(clearToken?: boolean): void {
    if (clearToken) {
      this.clearToken();
    }
    setTimeout(() => this.authStatus$.next(defaultAuthStatus), 0);
  }

  // TODO: put avaialble cache key names into an enum to avoid mistypes
  protected setToken(jwt: string) {
    this.cache.setItem('jwt', jwt);
  }

  getToken(): string {
    return this.cache.getItem('jwt') ?? '';
  }

  protected clearToken() {
    this.cache.removeItem('jwt');
  }

  protected hasExpiredToken(): boolean {
    const jwt = this.getToken();
    if (jwt) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload = jwtDecode(jwt) as any;
      return Date.now() >= payload.exp * 1000;
    }
    return true;
  }

  protected getAuthStatusFromToken(): IAuthStatus {
    return this.transformJwtToken(jwtDecode(this.getToken()));
  }
}
