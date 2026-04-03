export type TaskPhase = "1단계(인프라)" | "2단계(상세페이지)" | "3단계(마케팅)";

export interface Task {
  id: string;
  title: string;
  phase: TaskPhase;
  completed: boolean;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: "partner" | "boss";
  authorName: string;
  text: string;
  createdAt: string;
}

export type PartnerStatus = "지시완료" | "이행중" | "미이행(경고)";

export interface PartnerTask {
  id: string;
  title: string;
  status: PartnerStatus;
  current: number;
  total: number;
  unit: string;
}

export interface DriveLink {
  id: string;
  label: string;
  url: string;
}

export interface LogEntry {
  id: string;
  text: string;
  createdAt: string;
}

export interface DashboardState {
  tasks: Task[];
  partnerTasks: PartnerTask[];
  driveLinks: DriveLink[];
  logs: LogEntry[];
}
