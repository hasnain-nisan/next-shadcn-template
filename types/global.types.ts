export const ROLE_ACCESS_PRESETS: Record<string, string[]> = {
  InterviewUser: [
    "canAccessInterviews",
    "canCreateInterviews",
    "canUpdateInterviews",
    // newly added
    "canAccessClients",
    "canAccessProjects",
  ],
  Admin: [], // empty means uncheck all
};
