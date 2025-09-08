import { Client } from "./client.types";
import { UserRef } from "./user.types";
import { Project } from "./project.types";

export interface Interview {
  id: string;
  name: string;
  date: string; // ISO timestamp
  gDriveId: string | null;
  requestDistillation: string | null;
  requestCoaching: string | null;
  requestUserStories: string | null;
  client: Client;
  project: Project;
  createdBy: UserRef;
  updatedBy: UserRef;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
