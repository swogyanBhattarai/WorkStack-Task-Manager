import apiClient from "@/lib/apiClient";
import type {
  TaskResponse,
  TaskUpdate,
  PageResponse,
  TaskParams,
} from "@/types";

export async function getTasks(
  params?: TaskParams
): Promise<PageResponse<TaskResponse>> {
  const { data } = await apiClient.get<PageResponse<TaskResponse>>(
    "/api/task",
    { params }
  );
  return data;
}

export async function getTaskById(id: number): Promise<TaskResponse> {
  const { data } = await apiClient.get<TaskResponse>(`/api/task/${id}`);
  return data;
}

export async function addTask(task: {
  taskName: string;
  taskDescription: string;
  taskStatus: string;
  dueDate: string;
  taskLabels: string[];
}): Promise<string> {
  const { data } = await apiClient.post<string>("/api/task", task);
  return data;
}

export async function updateTask(
  id: number,
  update: TaskUpdate
): Promise<string> {
  const { data } = await apiClient.put<string>(`/api/task/update/${id}`, update);
  return data;
}

export async function deleteTask(id: number): Promise<string> {
  const { data } = await apiClient.delete<string>(`/api/task/delete/${id}`);
  return data;
}
