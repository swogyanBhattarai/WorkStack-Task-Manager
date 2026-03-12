import apiClient from "@/lib/apiClient";
import type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
  UserUpdate,
  PageResponse,
  PaginationParams,
  UserModel,
} from "@/types";

export async function login(username: string, password: string): Promise<string> {
  const { data } = await apiClient.post<string>("/api/user/login", {
    username,
    password,
  } satisfies LoginRequest);
  return data;
}

export async function registerUser(user: RegisterRequest): Promise<string> {
  const { data } = await apiClient.post<string>("/api/user/add", user);
  return data;
}

export async function getUsers(
  params?: PaginationParams
): Promise<PageResponse<UserResponse>> {
  const { data } = await apiClient.get<PageResponse<UserResponse>>("/api/user", {
    params,
  });
  return data;
}

export async function getUserById(id: number): Promise<UserModel> {
  const { data } = await apiClient.get<UserModel>(`/api/user/${id}`);
  return data;
}

export async function updateUser(id: number, update: UserUpdate): Promise<string> {
  const { data } = await apiClient.put<string>(`/api/user/update/${id}`, update);
  return data;
}

export async function deleteUser(id: number): Promise<string> {
  const { data } = await apiClient.delete<string>(`/api/user/delete/${id}`);
  return data;
}
