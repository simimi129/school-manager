import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../../../shared/data-access/generic-http/generic-http.service';
import { UserModelAdapter } from '../adapters/user.adapter';
import { UserDto, UserModel } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService extends GenericHttpService<UserDto, UserModel> {
  constructor() {
    super('/user', new UserModelAdapter());
  }
}
