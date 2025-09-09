export interface AnalyticsSnapshot {
  totalInterviews: number;
  completedInterviews: number;
  activeProjects: number;
  engagedClients: number;
  interviewTrend: { date: string; count: number }[];
}

export interface InterviewTrendPoint {
  date: string;
  count: number;
}

export interface AnalyticsType {
  totalInterviews: number;
  completedInterviews: number;
  activeProjects: number;
  engagedClients: number;
  interviewTrend: InterviewTrendPoint[];
}
