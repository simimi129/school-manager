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
import { User, IUser } from '../../../pages/user-profile/models/user';
import { jwtDecode } from 'jwt-decode';
import { transformError } from '../../util/common/common';

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
  protected abstract authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse>;
  protected abstract transformJwtToken(token: unknown): IAuthStatus;
  protected abstract getCurrentUser(): Observable<User>;
  authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus);
  currentUser$ = new BehaviorSubject<IUser>(new User());

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
