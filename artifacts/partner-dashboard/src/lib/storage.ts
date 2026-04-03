import type { DashboardState, Task, PartnerTask, DriveLink, LogEntry } from "../types";

const STORAGE_KEY = "mashitek-dashboard-v1";

const DEFAULT_TASKS: Task[] = [
  {
    id: "t1",
    title: "유튜브/틱톡 신규 채널 개설",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t2",
    title: "인스타그램 리뉴얼 (유월스마케팅관리)",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t3",
    title: "스마트스토어/쿠팡 업로드 키워드 리서치",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t4",
    title: "시장 분석",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t5",
    title: "피자설기 촬영",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t6",
    title: "메인 카피 작성",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t7",
    title: "상세페이지 디자인",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t8",
    title: "전 스토어 업로드 완료",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t9",
    title: "런칭 쇼츠 제작",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t10",
    title: "제1회 인스타 라이브 진행",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t11",
    title: "성과 리포트 발행",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
];

const DEFAULT_PARTNER_TASKS: PartnerTask[] = [
  {
    id: "p1",
    title: "피자설기 홍보 원고 작성",
    status: "이행중",
    current: 0,
    total: 50,
    unit: "개",
  },
  {
    id: "p2",
    title: "지역 커뮤니티/맘카페 바이럴",
    status: "지시완료",
    current: 0,
    total: 30,
    unit: "건",
  },
  {
    id: "p3",
    title: "체험단 모집 및 리스트 전달",
    status: "지시완료",
    current: 0,
    total: 30,
    unit: "명",
  },
];

const DEFAULT_DRIVE_LINKS: DriveLink[] = [
  {
    id: "d1",
    label: "촬영 원본 폴더",
    url: "https://drive.google.com",
  },
  {
    id: "d2",
    label: "마케팅 가이드라인 공유",
    url: "https://drive.google.com",
  },
  {
    id: "d3",
    label: "성과 리포트 보관함",
    url: "https://drive.google.com",
  },
];

const DEFAULT_STATE: DashboardState = {
  tasks: DEFAULT_TASKS,
  partnerTasks: DEFAULT_PARTNER_TASKS,
  driveLinks: DEFAULT_DRIVE_LINKS,
  logs: [],
};

export function loadState(): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<DashboardState>;
    return {
      tasks: parsed.tasks ?? DEFAULT_TASKS,
      partnerTasks: parsed.partnerTasks ?? DEFAULT_PARTNER_TASKS,
      driveLinks: parsed.driveLinks ?? DEFAULT_DRIVE_LINKS,
      logs: parsed.logs ?? [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: DashboardState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
