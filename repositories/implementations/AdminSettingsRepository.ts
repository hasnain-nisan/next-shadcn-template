import { makeApiRequest } from "@/lib/makeApiRequest";
import { API_ENDPOINTS } from "@/lib/constants";
import { IAdminSettingsRepository } from "../interfaces/IAdminSettingsRepository";
import { AdminSettings } from "@/types/adminSettings.types";

export class AdminSettingsRepository implements IAdminSettingsRepository {
  constructor() {}

  async getSingle(): Promise<AdminSettings> {
    return makeApiRequest<AdminSettings>(API_ENDPOINTS.adminSettings.getSingle);
  }

  async update(
    id: string,
    data: Partial<AdminSettings>
  ): Promise<AdminSettings> {
    const sanitizedData = {
      ...data,
      privateKey: data.privateKey?.trim() || undefined,
      clientEmail: data.clientEmail?.trim() || undefined,
      type: data.type?.trim() || undefined,
    };

    return makeApiRequest<AdminSettings>(
      API_ENDPOINTS.adminSettings.update(id),
      {
        method: "PUT",
        body: JSON.stringify(sanitizedData),
      }
    );
  }
}
