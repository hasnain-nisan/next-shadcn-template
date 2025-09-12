import { AdminSettings } from "@/types/adminSettings.types";

export interface IAdminSettingsService {
  getSingle(): Promise<AdminSettings>;

  update(
    id: string,
    data: {
      type?: string;
      privateKey?: string;
      clientEmail?: string;
      projectId?: string;
      privateKeyId?: string;
      clientId?: string;
      authUri?: string;
      tokenUri?: string;
      authProviderX509CertUrl?: string;
      clientX509CertUrl?: string;
      universeDomain?: string;
    }
  ): Promise<AdminSettings>;
}
