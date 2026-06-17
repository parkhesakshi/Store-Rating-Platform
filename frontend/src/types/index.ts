export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'ADMIN' | 'USER' | 'STORE_OWNER';
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  owner?: User;
  ratings?: Rating[];
  averageRating?: number;
  totalRatings?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Rating {
  id: string;
  score: number;
  userId: string;
  storeId: string;
  user?: User;
  store?: Store;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  address: string;
  role?: 'USER' | 'STORE_OWNER' | 'ADMIN';
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  errors?: Record<string, string[]>;
}

export type UserRole = 'ADMIN' | 'USER' | 'STORE_OWNER';