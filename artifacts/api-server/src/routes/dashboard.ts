import { Router } from "express";
import { db } from "@workspace/db";
import {
  dashboardTasks,
  dashboardTaskComments,
  dashboardPartnerTasks,
  dashboardDriveLinks,
  dashboardLogs,
} from "@workspace/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Seed defaults if DB is empty ────────────────────────────────────────────
async function seedIfEmpty() {
  const existing = await db.select().from(dashboardTasks).limit(1);
  if (existing.length > 0) return;

  const tasks = [
    { id: "t-i01", title: "스마트스토어 전시중지 상품 복구·정비", phase: "1단계(인프라)", sortOrder: 1 },
    { id: "t-i02", title: "스마트스토어 키워드 SEO 최적화 (피자설기·수제떡·선물용 등)", phase: "1단계(인프라)", sortOrder: 2 },
    { id: "t-i03", title: "쿠팡 마켓플레이스 입점 신청", phase: "1단계(인프라)", sortOrder: 3 },
    { id: "t-i04", title: "쿠팡 초기 상품 등록 (피자설기 포함)", phase: "1단계(인프라)", sortOrder: 4 },
    { id: "t-i05", title: "콜드체인 자체 배송 프로세스 정리 (냉장박스·아이스팩·택배사 선정)", phase: "1단계(인프라)", sortOrder: 5 },
    { id: "t-i06", title: "배송 안내·주의사항 페이지 제작", phase: "1단계(인프라)", sortOrder: 6 },
    { id: "t-i07", title: "인스타그램 피드 톤앤매너 정립·리뉴얼", phase: "1단계(인프라)", sortOrder: 7 },
    { id: "t-i08", title: "유튜브 채널 개설 및 기본 정보 세팅", phase: "1단계(인프라)", sortOrder: 8 },
    { id: "t-i09", title: "틱톡 채널 개설 및 기본 정보 세팅", phase: "1단계(인프라)", sortOrder: 9 },
    { id: "t-i10", title: "경쟁사·시장 분석 (수제떡 카테고리 벤치마킹)", phase: "1단계(인프라)", sortOrder: 10 },
    { id: "t-i11", title: "월간 콘텐츠 캘린더 1차 작성 (라방 일정 포함)", phase: "1단계(인프라)", sortOrder: 11 },
    { id: "t-d01", title: "피자설기 촬영 기획 (콘셉트·소품·배경 구성)", phase: "2단계(상세페이지)", sortOrder: 12 },
    { id: "t-d02", title: "피자설기 제품 촬영 진행", phase: "2단계(상세페이지)", sortOrder: 13 },
    { id: "t-d03", title: "촬영 사진 편집·보정 (보정 10컷 이상)", phase: "2단계(상세페이지)", sortOrder: 14 },
    { id: "t-d04", title: "메인 카피 작성 (헤드카피·서브카피·설명문)", phase: "2단계(상세페이지)", sortOrder: 15 },
    { id: "t-d05", title: "스마트스토어 상세페이지 디자인 제작", phase: "2단계(상세페이지)", sortOrder: 16 },
    { id: "t-d06", title: "쿠팡 상세페이지 디자인 제작", phase: "2단계(상세페이지)", sortOrder: 17 },
    { id: "t-d07", title: "썸네일 이미지 제작 (플랫폼별 규격 맞춤)", phase: "2단계(상세페이지)", sortOrder: 18 },
    { id: "t-d08", title: "배송 안내·냉장 보관 안내 이미지 제작", phase: "2단계(상세페이지)", sortOrder: 19 },
    { id: "t-d09", title: "스마트스토어 상품 업로드 완료", phase: "2단계(상세페이지)", sortOrder: 20 },
    { id: "t-d10", title: "쿠팡 상품 업로드 완료", phase: "2단계(상세페이지)", sortOrder: 21 },
    { id: "t-m01", title: "인스타그램 피자설기 첫 피드 게시 (사진+카피+해시태그)", phase: "3단계(마케팅)", sortOrder: 22 },
    { id: "t-m02", title: "인스타그램 릴스 제작·업로드 (피자설기 비주얼 영상)", phase: "3단계(마케팅)", sortOrder: 23 },
    { id: "t-m03", title: "인스타 라이브 1회 시범 운영 (방송 세팅·첫 팬 소통)", phase: "3단계(마케팅)", sortOrder: 24 },
    { id: "t-m04", title: "인스타 라방 사전 홍보 콘텐츠 제작 (D-3 예고 스토리·피드)", phase: "3단계(마케팅)", sortOrder: 25 },
    { id: "t-m05", title: "틱톡 쇼츠 콘텐츠 제작·업로드 (트렌드 편집)", phase: "3단계(마케팅)", sortOrder: 26 },
    { id: "t-m06", title: "유튜브 쇼츠 업로드 (라방 클립 재편집 포함)", phase: "3단계(마케팅)", sortOrder: 27 },
    { id: "t-m07", title: "메타(인스타) 소액 광고 1차 테스트 집행", phase: "3단계(마케팅)", sortOrder: 28 },
    { id: "t-m08", title: "쿠팡 광고 소액 1차 테스트 집행", phase: "3단계(마케팅)", sortOrder: 29 },
    { id: "t-m09", title: "스마트스토어·쿠팡 구매 리뷰 30개+ 달성 목표 관리", phase: "3단계(마케팅)", sortOrder: 30 },
    { id: "t-m10", title: "체험단 30명 모집·발송·리뷰 확인", phase: "3단계(마케팅)", sortOrder: 31 },
    { id: "t-m11", title: "고객 문의·리뷰 모니터링 및 대응 (매일)", phase: "3단계(마케팅)", sortOrder: 32 },
    { id: "t-m12", title: "1차 성과 리포트 발행 (매출·방문자·팔로워·라방 성과 종합)", phase: "3단계(마케팅)", sortOrder: 33 },
  ];

  await db.insert(dashboardTasks).values(
    tasks.map((t) => ({ ...t, completed: false }))
  );

  await db.insert(dashboardPartnerTasks).values([
    { id: "p1", title: "피자설기 홍보 원고 작성 (블로그·카페·커뮤니티용)", status: "이행중", current: 0, total: 50, unit: "개", sortOrder: 1 },
    { id: "p2", title: "지역 커뮤니티/맘카페 바이럴 게시", status: "지시완료", current: 0, total: 30, unit: "건", sortOrder: 2 },
    { id: "p3", title: "체험단 모집 및 리스트 전달", status: "지시완료", current: 0, total: 30, unit: "명", sortOrder: 3 },
  ]);

  await db.insert(dashboardDriveLinks).values([
    { id: "d1", label: "촬영 원본 폴더", url: "https://drive.google.com", sortOrder: 1 },
    { id: "d2", label: "마케팅 가이드라인 공유", url: "https://drive.google.com", sortOrder: 2 },
    { id: "d3", label: "성과 리포트 보관함", url: "https://drive.google.com", sortOrder: 3 },
  ]);
}

// ─── GET /api/dashboard ────────────────────────────────────────────────────
router.get("/dashboard", async (_req, res) => {
  try {
    await seedIfEmpty();

    const [tasks, comments, partnerTasks, driveLinks, logs] = await Promise.all([
      db.select().from(dashboardTasks).orderBy(asc(dashboardTasks.sortOrder), asc(dashboardTasks.createdAt)),
      db.select().from(dashboardTaskComments).orderBy(asc(dashboardTaskComments.createdAt)),
      db.select().from(dashboardPartnerTasks).orderBy(asc(dashboardPartnerTasks.sortOrder)),
      db.select().from(dashboardDriveLinks).orderBy(asc(dashboardDriveLinks.sortOrder)),
      db.select().from(dashboardLogs).orderBy(desc(dashboardLogs.createdAt)).limit(100),
    ]);

    const tasksWithComments = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      phase: t.phase,
      completed: t.completed,
      comments: comments
        .filter((c) => c.taskId === t.id)
        .map((c) => ({
          id: c.id,
          author: c.author,
          authorName: c.authorName,
          text: c.text,
          createdAt: c.createdAt.toISOString(),
        })),
    }));

    res.json({
      tasks: tasksWithComments,
      partnerTasks: partnerTasks.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        current: p.current,
        total: p.total,
        unit: p.unit,
      })),
      driveLinks: driveLinks.map((d) => ({ id: d.id, label: d.label, url: d.url })),
      logs: logs.map((l) => ({ id: l.id, text: l.text, createdAt: l.createdAt.toISOString() })),
    });
  } catch (err) {
    logger.error({ err }, "Error fetching dashboard");
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

// ─── Tasks ─────────────────────────────────────────────────────────────────
router.post("/dashboard/tasks", async (req, res) => {
  try {
    const { title, phase } = req.body as { title: string; phase: string };
    const count = await db.select().from(dashboardTasks);
    const id = genId();
    const [task] = await db
      .insert(dashboardTasks)
      .values({ id, title, phase, completed: false, sortOrder: count.length + 1 })
      .returning();
    res.json({ id: task!.id, title: task!.title, phase: task!.phase, completed: task!.completed, comments: [] });
  } catch (err) {
    logger.error({ err }, "Error adding task");
    res.status(500).json({ error: "Failed to add task" });
  }
});

router.patch("/dashboard/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body as Partial<{ completed: boolean; title: string; phase: string }>;
    await db.update(dashboardTasks).set(updates).where(eq(dashboardTasks.id, id!));
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Error updating task");
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.delete("/dashboard/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(dashboardTasks).where(eq(dashboardTasks.id, id!));
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Error deleting task");
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// ─── Task Comments ──────────────────────────────────────────────────────────
router.post("/dashboard/tasks/:taskId/comments", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { author, authorName, text } = req.body as { author: string; authorName: string; text: string };
    const id = genId();
    const [comment] = await db
      .insert(dashboardTaskComments)
      .values({ id, taskId: taskId!, author, authorName, text })
      .returning();
    res.json({
      id: comment!.id,
      author: comment!.author,
      authorName: comment!.authorName,
      text: comment!.text,
      createdAt: comment!.createdAt.toISOString(),
    });
  } catch (err) {
    logger.error({ err }, "Error adding comment");
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// ─── Partner Tasks ──────────────────────────────────────────────────────────
router.post("/dashboard/partner-tasks", async (req, res) => {
  try {
    const { title, total, unit } = req.body as { title: string; total: number; unit: string };
    const count = await db.select().from(dashboardPartnerTasks);
    const id = genId();
    const [task] = await db
      .insert(dashboardPartnerTasks)
      .values({ id, title, status: "지시완료", current: 0, total, unit, sortOrder: count.length + 1 })
      .returning();
    res.json({ id: task!.id, title: task!.title, status: task!.status, current: task!.current, total: task!.total, unit: task!.unit });
  } catch (err) {
    logger.error({ err }, "Error adding partner task");
    res.status(500).json({ error: "Failed to add partner task" });
  }
});

router.patch("/dashboard/partner-tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body as Partial<{ status: string; current: number; total: number; title: string }>;
    await db.update(dashboardPartnerTasks).set(updates).where(eq(dashboardPartnerTasks.id, id!));
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Error updating partner task");
    res.status(500).json({ error: "Failed to update partner task" });
  }
});

router.delete("/dashboard/partner-tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(dashboardPartnerTasks).where(eq(dashboardPartnerTasks.id, id!));
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Error deleting partner task");
    res.status(500).json({ error: "Failed to delete partner task" });
  }
});

// ─── Drive Links ────────────────────────────────────────────────────────────
router.post("/dashboard/drive-links", async (req, res) => {
  try {
    const { label, url } = req.body as { label: string; url: string };
    const count = await db.select().from(dashboardDriveLinks);
    const id = genId();
    const [link] = await db
      .insert(dashboardDriveLinks)
      .values({ id, label, url, sortOrder: count.length + 1 })
      .returning();
    res.json({ id: link!.id, label: link!.label, url: link!.url });
  } catch (err) {
    logger.error({ err }, "Error adding drive link");
    res.status(500).json({ error: "Failed to add drive link" });
  }
});

router.patch("/dashboard/drive-links/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body as Partial<{ label: string; url: string }>;
    await db.update(dashboardDriveLinks).set(updates).where(eq(dashboardDriveLinks.id, id!));
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Error updating drive link");
    res.status(500).json({ error: "Failed to update drive link" });
  }
});

router.delete("/dashboard/drive-links/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(dashboardDriveLinks).where(eq(dashboardDriveLinks.id, id!));
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Error deleting drive link");
    res.status(500).json({ error: "Failed to delete drive link" });
  }
});

// ─── Logs ───────────────────────────────────────────────────────────────────
router.post("/dashboard/logs", async (req, res) => {
  try {
    const { text } = req.body as { text: string };
    const id = genId();
    const [log] = await db.insert(dashboardLogs).values({ id, text }).returning();
    res.json({ id: log!.id, text: log!.text, createdAt: log!.createdAt.toISOString() });
  } catch (err) {
    logger.error({ err }, "Error adding log");
    res.status(500).json({ error: "Failed to add log" });
  }
});

router.delete("/dashboard/logs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(dashboardLogs).where(eq(dashboardLogs.id, id!));
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Error deleting log");
    res.status(500).json({ error: "Failed to delete log" });
  }
});

export default router;
