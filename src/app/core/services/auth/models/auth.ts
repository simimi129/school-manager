export interface IAuthStatus {
  userId: string;
  roles: Role[];
}

export interface ITokens {
  token: string;
  refreshToken: string;
}

export enum Role {
  NONE,
  ADMIN,
  STUDENT,
  TEACHER,
  PRINCIPAL,
  PARENT,
}
