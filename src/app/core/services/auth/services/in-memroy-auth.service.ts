import { Injectable } from '@angular/core';
import { AuthService, IAuthStatus, IServerAuthResponse } from './auth.service';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../../../../pages/user-profile/models/user';
import { Role } from '../models/auth.enum';
import { sign } from 'fake-jwt-sign';

@Injectable({
  providedIn: 'root',
})
export class InMemroyAuthService extends AuthService {
  private defaultUser = User.Build({
    _id: 'asd123',
    name: { firstName: 'Simon', lastName: 'Szabó' },
    email: 'test@test.com',
    phone: '06306489940',
    address: {
      city: 'Budapest',
      zip: '1087',
      street: 'Osztály u.',
    },
    dateOfBirth: new Date(),
    picture: 'no pic',
    role: Role.Admin,
  });

  protected authProvider(
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: string
  ): Observable<IServerAuthResponse> {
    email = email.toLowerCase();
    if (!email.endsWith('@test.com')) {
      return throwError('Failed to login! Email needs to end with @test.com.');
    }

    const authStatus: IAuthStatus = {
      isAuthenticated: true,
      userId: this.defaultUser._id,
      role: Role.Admin,
    };

    this.defaultUser.role = authStatus.role;

    const authResponse: IServerAuthResponse = {
      accessToken: sign(authStatus, 'secret', {
        expiresIn: '1h',
        alogrithm: 'none',
      }),
    };

    return of(authResponse);
  }

  protected transformJwtToken(token: IAuthStatus): IAuthStatus {
    return token;
  }

  protected getCurrentUser(): Observable<User> {
    return of(this.defaultUser);
  }
}
