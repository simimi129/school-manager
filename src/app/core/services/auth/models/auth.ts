export enum Role {
  None = 'none',
  Admin = 'admin',
  Student = 'student',
  Teacher = 'teacher',
  Principal = 'principal',
  Parent = 'parent',
}

export interface ILoginResponse {
  username: string;
  token: string;
}
