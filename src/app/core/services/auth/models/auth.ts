export enum Role {
  NONE,
  ADMIN,
  STUDENT,
  TEACHER,
  PRINCIPAL,
  PARENT,
}

export interface ILoginResponse {
  acessToken: string;
  userId: string;
  role: Role;
}
