import { Project } from "./project.types";
import { UserRef } from "./user.types";

export interface Config {
  id: string;
  projectId: string;
  project: Project;
  version: number;
  is_latest: boolean;
  isDeleted: boolean;
  config: ConfigJson
  change_summary?: string | null;
  created_by: UserRef | null;
  updated_by: UserRef | null;
  created_at: string;
  updated_at: string;
}

export interface ConfigJson {
    client: string;
    client_code: string;
    project_name: string;
    project_desc: string;
    example1?: string;
    example2?: string;
    example3?: string;
    categories_flag?: string;
    us_categories: Record<string, string>;
    custom_context?: string;
    email_confirmation: string[];
    interview_tracker_gdrive_id?: string;
    interview_repository_gdrive_url?: string;
    global_repository_gdrive_url?: string;
    output_gdrive_url?: string;
    logging_output_url?: string;
  };
