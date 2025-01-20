import { Role } from '../../../core/services/auth/models/auth.enum';
import { AddressModel } from './address.interface';
import { NameModel } from './name.interface';

export interface IUser {
  _id: string | null;
  name: NameModel;
  email: string;
  phone: string;
  address: AddressModel;
  dateOfBirth: Date | string | null;
  picture: string;
  role: Role;
  fullName?: string;
}

export class User implements IUser {
  constructor(
    public _id: string | null = null,
    public name = { firstName: '', lastName: '' } as NameModel,
    public email = '',
    public phone = '',
    public address = { street: '', city: '', zip: '' } as AddressModel,
    public dateOfBirth: Date | string | null = null,
    public picture = '',
    public role = Role.None
  ) {}

  static Build(user: IUser): User {
    if (!user) {
      return new User();
    }

    return new User(
      user._id,
      user.name,
      user.email,
      user.phone,
      user.address,
      typeof user.dateOfBirth === 'string'
        ? new Date(user.dateOfBirth)
        : user.dateOfBirth,
      user.picture,
      user.role
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
