import { description } from './../components/chart-area-interactive';
import { Client } from "./client.types";
import { Interview } from "./interview.types";
import { ClientStakeholder } from "./stakeholder.types";
import { UserRef } from "./user.types";

export interface Project {
  id: string;
  name: string;
  clientTeam: string | null;
  client: Client;
  // stakeholders: ClientStakeholder[];
  description: string;
  createdBy: UserRef;
  updatedBy: UserRef;
  interviews: Interview[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
