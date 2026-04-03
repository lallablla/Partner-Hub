import type { DashboardState, Task, PartnerTask, DriveLink, LogEntry } from "../types";

const STORAGE_KEY = "mashitek-dashboard-v2";

const DEFAULT_TASKS: Task[] = [
  // ── 1단계(인프라) ──────────────────────────────────
  {
    id: "t-i01",
    title: "스마트스토어 전시중지 상품 복구·정비",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t-i02",
    title: "스마트스토어 키워드 SEO 최적화 (피자설기·수제떡·선물용 등)",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t-i03",
    title: "쿠팡 마켓플레이스 입점 신청",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t-i04",
    title: "쿠팡 초기 상품 등록 (피자설기 포함)",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t-i05",
    title: "콜드체인 자체 배송 프로세스 정리 (냉장박스·아이스팩·택배사 선정)",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t-i06",
    title: "배송 안내·주의사항 페이지 제작",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t-i07",
    title: "인스타그램 피드 톤앤매너 정립·리뉴얼",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t-i08",
    title: "유튜브 채널 개설 및 기본 정보 세팅",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t-i09",
    title: "틱톡 채널 개설 및 기본 정보 세팅",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t-i10",
    title: "경쟁사·시장 분석 (수제떡 카테고리 벤치마킹)",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },
  {
    id: "t-i11",
    title: "월간 콘텐츠 캘린더 1차 작성 (라방 일정 포함)",
    phase: "1단계(인프라)",
    completed: false,
    comments: [],
  },

  // ── 2단계(상세페이지) ──────────────────────────────
  {
    id: "t-d01",
    title: "피자설기 촬영 기획 (콘셉트·소품·배경 구성)",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t-d02",
    title: "피자설기 제품 촬영 진행",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t-d03",
    title: "촬영 사진 편집·보정 (보정 10컷 이상)",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t-d04",
    title: "메인 카피 작성 (헤드카피·서브카피·설명문)",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t-d05",
    title: "스마트스토어 상세페이지 디자인 제작",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t-d06",
    title: "쿠팡 상세페이지 디자인 제작",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t-d07",
    title: "썸네일 이미지 제작 (플랫폼별 규격 맞춤)",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t-d08",
    title: "배송 안내·냉장 보관 안내 이미지 제작",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t-d09",
    title: "스마트스토어 상품 업로드 완료",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },
  {
    id: "t-d10",
    title: "쿠팡 상품 업로드 완료",
    phase: "2단계(상세페이지)",
    completed: false,
    comments: [],
  },

  // ── 3단계(마케팅) ──────────────────────────────────
  {
    id: "t-m01",
    title: "인스타그램 피자설기 첫 피드 게시 (사진+카피+해시태그)",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t-m02",
    title: "인스타그램 릴스 제작·업로드 (피자설기 비주얼 영상)",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t-m03",
    title: "인스타 라이브 1회 시범 운영 (방송 세팅·첫 팬 소통)",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t-m04",
    title: "인스타 라방 사전 홍보 콘텐츠 제작 (D-3 예고 스토리·피드)",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t-m05",
    title: "틱톡 쇼츠 콘텐츠 제작·업로드 (트렌드 편집)",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t-m06",
    title: "유튜브 쇼츠 업로드 (라방 클립 재편집 포함)",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t-m07",
    title: "메타(인스타) 소액 광고 1차 테스트 집행",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t-m08",
    title: "쿠팡 광고 소액 1차 테스트 집행",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t-m09",
    title: "스마트스토어·쿠팡 구매 리뷰 30개+ 달성 목표 관리",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t-m10",
    title: "체험단 30명 모집·발송·리뷰 확인",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t-m11",
    title: "고객 문의·리뷰 모니터링 및 대응 (매일)",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
  {
    id: "t-m12",
    title: "1차 성과 리포트 발행 (매출·방문자·팔로워·라방 성과 종합)",
    phase: "3단계(마케팅)",
    completed: false,
    comments: [],
  },
];

const DEFAULT_PARTNER_TASKS: PartnerTask[] = [
  {
    id: "p1",
    title: "피자설기 홍보 원고 작성 (블로그·카페·커뮤니티용)",
    status: "이행중",
    current: 0,
    total: 50,
    unit: "개",
  },
  {
    id: "p2",
    title: "지역 커뮤니티/맘카페 바이럴 게시",
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
