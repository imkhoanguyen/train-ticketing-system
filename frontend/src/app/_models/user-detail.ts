export interface UserDetail {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  cmnd: string;
  role: string;
  token: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}
