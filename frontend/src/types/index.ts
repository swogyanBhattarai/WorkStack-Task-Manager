// ─── ProjectModel Entity ─────────────────────────────

export interface ProjectModel {
  projectId: number;
  projectName: string;
  description: string;
  projectStatus: "COMPLETED" | "PENDING";
  createdAt: string;
  updatedAt: string;
  users: UserModel[];
  tasks: any[]; // You can replace 'any' with TaskModel if you have a matching interface
}
// ─── Enums ───────────────────────────────────────────────

export enum Activity {
  READ = "READ",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
}

export enum ProjectStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
}

export enum TaskStatus {
  COMPLETED = "COMPLETED",
  ONGOING = "ONGOING",
}

// ─── Generic Paginated Response ──────────────────────────

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}

// ─── Activity ────────────────────────────────────────────

export interface ActivityResponse {
  activityId: number;
  activity: Activity;
  userId: number;
  username: string;
  activityDescription: string;
  createdAt: string;
}

// ─── Project ─────────────────────────────────────────────

export interface ProjectUserResponse {
  id: number;
  username: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectResponse {
  projectId: number;
  projectName: string;
  description: string;
  projectStatus: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  users: ProjectUserResponse[];
  tasks: TaskResponse[];
}

export interface ProjectUpdate {
  projectName: string;
  projectDescription: string;
  projectStatus: ProjectStatus;
  userIds: number[];
  taskIds: number[];
}

// ─── Task ────────────────────────────────────────────────

export interface TaskProjectResponse {
  projectId: number;
  projectName: string;
  description: string;
  projectStatus: ProjectStatus;
}

export interface TaskResponse {
  taskId: number;
  taskName: string;
  taskDescription: string;
  taskStatus: TaskStatus;
  dueDate: string;
  takLabels: string[];
  createdAt: string;
  updatedAt: string;
  project: TaskProjectResponse;
}

export interface TaskUpdate {
  taskName: string;
  taskDescription: string;
  taskStatus: TaskStatus;
  taskLabels: string[];
  dueDate: string;
}

// ─── User ────────────────────────────────────────────────

export interface UserModel {
  id: number;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  projects?: any[];
  activityLog?: any[];
}

export interface UserProjectResponse {
  projectId: number;
  projectName: string;
  description: string;
  tasks: TaskResponse[];
}

export interface UserResponse {
  id: number;
  username: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdate {
  username: string;
  roles: string[];
  projectIds: number[];
}

// ─── Auth ────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  roles: string[];
}

export interface JwtPayload {
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}

// ─── Spring Boot Error ──────────────────────────────────

export interface SpringBootError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// ─── Query Params ────────────────────────────────────────

export interface PaginationParams {
  pageNum?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  search?: string;
}

export interface ProjectParams {
  pageNum?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  projectSearch?: string;
  statusSearch?: string;
}

export interface TaskParams {
  pageNum?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  taskName?: string;
}

export interface ActivityLogParams {
  pageNum?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  userSearch?: string;
  activitySearch?: string;
}
