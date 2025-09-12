import { UserRef } from "./user.types";

export interface AdminSettings {
  id: string;
  type: string;
  privateKey: string;
  clientEmail: string;

  // Optional fields (include if used in backend or UI)
  projectId?: string;
  privateKeyId?: string;
  clientId?: string;
  authUri?: string;
  tokenUri?: string;
  authProviderX509CertUrl?: string;
  clientX509CertUrl?: string;
  universeDomain?: string;

  createdBy: UserRef;
  updatedBy: UserRef;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}