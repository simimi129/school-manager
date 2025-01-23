import { ModelAdapter } from '../../../../../shared/data-access/model-adapter/model-adapter.interface';
import { UserDto, UserModel } from '../models/user';

export class UserModelAdapter implements ModelAdapter<UserDto, UserModel> {
  fromDto(dto: UserDto): UserModel {
    return {
      _id: dto._id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      dateOfBirth: dto.dateOfBirth,
      picture: dto.picture,
    };
  }

  toDto(model: UserModel): UserDto {
    return {
      _id: model._id,
      name: model.name,
      email: model.email,
      phone: model.phone,
      address: model.address,
      dateOfBirth: model.dateOfBirth,
      picture: model.picture,
    };
  }
}
