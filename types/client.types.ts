import { Interview } from "./interview.types";
import { Project } from "./project.types";
import { ClientStakeholder } from "./stakeholder.types";
import { UserRef } from "./user.types";

export interface Client {
  id: string;
  name: string;
  clientCode: string;
  createdBy: UserRef;
  updatedBy: UserRef | null;
  stakeholders: ClientStakeholder[];
  projects: Project[];
  interviews: Interview[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
