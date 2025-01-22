export interface IAuthStatus {
  token: string;
  refreshToken: string;
  userId: string;
  roles: Role[];
}

export enum Role {
  NONE,
  ADMIN,
  STUDENT,
  TEACHER,
  PRINCIPAL,
  PARENT,
}
