export interface IAuthStatus {
  token: string;
  userId: string;
  role: Role;
}

export enum Role {
  NONE,
  ADMIN,
  STUDENT,
  TEACHER,
  PRINCIPAL,
  PARENT,
}
