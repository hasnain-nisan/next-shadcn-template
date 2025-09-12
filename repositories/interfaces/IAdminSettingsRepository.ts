import { AdminSettings } from "@/types/adminSettings.types";

export interface IAdminSettingsRepository {
  getSingle(): Promise<AdminSettings>;

  update(id: string, data: Partial<AdminSettings>): Promise<AdminSettings>;
}
