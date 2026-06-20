export interface ScheduleItem {
  day: number;
  topics: string;
  duration: string;
}

export interface StudyPlan {
  id: string;
  subject: string;
  topics: string;
  exam_date: string;
  schedule: ScheduleItem[];
  created_at: string;
}

export interface GeneratePlanRequest {
  subject: string;
  topics: string;
  examDate: string;
}

export interface GeneratePlanResponse {
  plan?: StudyPlan;
  error?: string;
}
