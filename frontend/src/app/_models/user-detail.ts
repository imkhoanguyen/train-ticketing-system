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

export interface User {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  cmnd: string;
  role: string;
}

export interface UserUpdate {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  cmnd: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  fullName: string;
  password: string;
  email: string;
  phone: string;
  cmnd: string;
}
