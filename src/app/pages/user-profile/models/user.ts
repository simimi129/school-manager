import { AddressModel } from './address.interface';
import { NameModel } from './name.interface';

export interface UserModel {
  id: number | null;
  name: NameModel;
  email: string;
  phone: string;
  address: AddressModel;
  dateOfBirth: Date | string | null;
  picture: string;
  fullName: string;
}

export class User implements UserModel {
  constructor(
    public id: number | null = null,
    public name = { firstName: '', lastName: '' } as NameModel,
    public email = '',
    public phone = '',
    public address = { street: '', city: '', zip: '' } as AddressModel,
    public dateOfBirth: Date | string | null = null,
    public picture = ''
  ) {}

  static Build(user: UserModel): User {
    if (!user) {
      return new User();
    }

    return new User(
      user.id,
      user.name,
      user.email,
      user.phone,
      user.address,
      typeof user.dateOfBirth === 'string'
        ? new Date(user.dateOfBirth)
        : user.dateOfBirth,
      user.picture
    );
  }

  public get fullName(): string {
    if (!this.name) {
      return '';
    }

    if (this.name.middleName) {
      return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
    }

    return `${this.name.firstName} ${this.name.lastName}`;
  }

  toJSON(): object {
    const serialized = Object.assign(this);
    delete serialized.id;
    delete serialized.fullName;
    return serialized;
  }
}
