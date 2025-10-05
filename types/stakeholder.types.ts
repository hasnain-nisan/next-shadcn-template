import { Interview } from "@/types/interview.types";
import { Client } from "./client.types";
import { Project } from "./project.types";
import { UserRef } from "./user.types";

export interface ClientStakeholder {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  client: Client;
  role: string | null;
  team: string | null;
  createdBy: UserRef;
  updatedBy: UserRef | null;
  interviews: Interview[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  company: string | null;
}
