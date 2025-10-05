import { makeApiRequest } from "@/lib/makeApiRequest";
import { API_ENDPOINTS } from "@/lib/constants";
import { IConfigRepository } from "../interfaces/IConfigRepository";
import { Config, ConfigJson } from "@/types/config.types";

export class ConfigRepository implements IConfigRepository {
  constructor() {}

  async getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    projectId?: string;
    version?: number;
    // is_latest?: boolean;
    created_by?: string;
    deletedStatus?: string;
  }): Promise<{
    items: Config[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const query = new URLSearchParams({
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 10),
    });

    if (params?.sortField) query.append("sortField", params.sortField);
    if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
    if (params?.projectId)
      query.append(
        "projectId",
        params.projectId === "all" ? "" : params.projectId
      );
    if (params?.version)
      query.append(
        "version",
        String(params.version) === "all" ? "" : String(params.version)
      );
    // if (params?.is_latest !== undefined)
    //   query.append("is_latest", String(params.is_latest));
    if (params?.created_by) query.append("created_by", params.created_by);
    if (params?.deletedStatus)
      query.append(
        "isDeleted",
        params.deletedStatus === "all" ? "" : params.deletedStatus
      );

    const endpoint = `${API_ENDPOINTS.configs.getAll}?${query.toString()}`;
    return makeApiRequest(endpoint);
  }

  async getById(id: string): Promise<Config> {
    return makeApiRequest<Config>(API_ENDPOINTS.configs.getById(id));
  }

  async create(data: {
    projectId: string;
    config: Partial<Config["config"]>;
    change_summary?: string;
  }): Promise<Config> {
    const { projectId, config, change_summary } = data;

    const {
      interview_repository_gdrive_url,
      global_repository_gdrive_url,
      output_gdrive_url,
      logging_output_url,
      email_confirmation,
      ...restConfig
    } = config;

    const sanitizedConfig: Partial<Config["config"]> = {
      ...restConfig,
      interview_repository_gdrive_url:
        interview_repository_gdrive_url?.trim() || undefined,
      global_repository_gdrive_url:
        global_repository_gdrive_url?.trim() || undefined,
      output_gdrive_url: output_gdrive_url?.trim() || undefined,
      logging_output_url: logging_output_url?.trim() || undefined,
      email_confirmation:
        email_confirmation && email_confirmation.length > 0
          ? email_confirmation
          : undefined,
    };

    return makeApiRequest<Config>(API_ENDPOINTS.configs.create, {
      method: "POST",
      body: JSON.stringify({
        projectId,
        ...sanitizedConfig,
        change_summary,
      }),
    });
  }

  async update(id: string, data: Partial<Config>): Promise<Config> {
    const { projectId, change_summary, ...rawConfig } = data;

    const {
      interview_repository_gdrive_url,
      global_repository_gdrive_url,
      output_gdrive_url,
      logging_output_url,
      email_confirmation,
      ...restConfig
    } = rawConfig as ConfigJson || {};
    

    const sanitizedConfig: Partial<Config["config"]> = {
      ...restConfig,
      interview_repository_gdrive_url:
        interview_repository_gdrive_url?.trim() || undefined,
      global_repository_gdrive_url:
        global_repository_gdrive_url?.trim() || undefined,
      output_gdrive_url: output_gdrive_url?.trim() || undefined,
      logging_output_url: logging_output_url?.trim() || undefined,
      email_confirmation:
        email_confirmation && email_confirmation.length > 0
          ? email_confirmation
          : undefined,
    };

    return makeApiRequest<Config>(API_ENDPOINTS.configs.update(id), {
      method: "PUT",
      body: JSON.stringify({
        projectId,
        ...sanitizedConfig,
        change_summary,
      }),
    });
  }

  async delete(id: string): Promise<void> {
    await makeApiRequest<void>(API_ENDPOINTS.configs.delete(id), {
      method: "DELETE",
    });
  }
}
