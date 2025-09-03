/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRef } from "./user.types";

export interface Client {
  id: string;
  name: string;
  clientCode: string;
  createdBy: UserRef;
  updatedBy: UserRef | null;
  stakeholders: any[]; // Replace `any` with `Stakeholder` type if available
  projects: any[]; // Replace `any` with `Project` type if available
  interviews: any[]; // Replace `any` with `Interview` type if available
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
