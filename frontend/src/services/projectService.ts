
import apiClient from "@/lib/apiClient";
import type {
  ProjectResponse,
  ProjectUpdate,
  PageResponse,
  ProjectParams,
  ProjectModel
} from "@/types";

export async function getProjects(
  params?: ProjectParams
): Promise<PageResponse<ProjectResponse>> {
  const { data } = await apiClient.get<PageResponse<ProjectResponse>>(
    "/api/project",
    { params }
  );
  return data;
}

export async function getProjectById(id: number): Promise<ProjectModel> {
  const { data } = await apiClient.get<ProjectModel>(`/api/project/${id}`);
  return data;
}

export async function addProject(project: {
  projectName: string;
  description: string;
  projectStatus: string;
}): Promise<string> {
  const { data } = await apiClient.post<string>("/api/project/add", project);
  return data;
}

export async function updateProject(
  id: number,
  update: ProjectUpdate
): Promise<string> {
  const { data } = await apiClient.put<string>(
    `/api/project/update/${id}`,
    update
  );
  return data;
}

export async function deleteProject(id: number): Promise<string> {
  const { data } = await apiClient.delete<string>(`/api/project/delete/${id}`);
  return data;
}
