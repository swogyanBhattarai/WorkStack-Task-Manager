import apiClient from "@/lib/apiClient";
import type {
  ActivityResponse,
  PageResponse,
  ActivityLogParams,
} from "@/types";

export async function getActivityLogs(
  params?: ActivityLogParams
): Promise<PageResponse<ActivityResponse>> {
  const { data } = await apiClient.get<PageResponse<ActivityResponse>>(
    "/api/log",
    { params }
  );
  return data;
}
