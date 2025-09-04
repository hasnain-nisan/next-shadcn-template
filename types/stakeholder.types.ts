/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from './client.types';
import { UserRef } from './user.types';

export interface ClientStakeholder {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  client: Client;
  createdBy: UserRef;
  updatedBy: UserRef | null;
  projects: any[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}