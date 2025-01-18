import { AddressModel } from './address.interface';
import { NameModel } from './name.interface';

export interface UserModel {
  id: number;
  name: NameModel;
  email: string;
  phone: string;
  addres: AddressModel;
  dateOfBirth: Date;
  picture: string;
}
