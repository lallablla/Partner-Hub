import { Router } from "express";
import { db } from "@workspace/db";
import { dashboardSales } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function todayKST() {
  return new Date().toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\. /g, "-").replace(".", "");
}

function formatRow(r: typeof dashboardSales.$inferSelect) {
  const naverNet = r.naverGross - r.naverRefund;
  const coupangNet = r.coupangGross - r.coupangRefund;
  return {
    id: r.id,
    date: r.date,
    naverGross: r.naverGross,
    naverRefund: r.naverRefund,
    naverNet,
    coupangGross: r.coupangGross,
    coupangRefund: r.coupangRefund,
    coupangNet,
    totalNet: naverNet + coupangNet,
    memo: r.memo,
  };
}

// GET /api/sales — last 30 days
router.get("/sales", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(dashboardSales)
      .orderBy(desc(dashboardSales.date))
      .limit(30);
    res.json(rows.map(formatRow));
  } catch (err) {
    logger.error({ err }, "Error fetching sales");
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

// GET /api/sales/today — upsert & return today's entry
router.get("/sales/today", async (_req, res) => {
  try {
    const date = todayKST();
    let [row] = await db
      .select()
      .from(dashboardSales)
      .where(eq(dashboardSales.date, date));
    if (!row) {
      const id = genId();
      [row] = await db
        .insert(dashboardSales)
        .values({ id, date, naverGross: 0, naverRefund: 0, coupangGross: 0, coupangRefund: 0, memo: "" })
        .returning();
    }
    res.json(formatRow(row!));
  } catch (err) {
    logger.error({ err }, "Error fetching today sales");
    res.status(500).json({ error: "Failed to fetch today sales" });
  }
});

// PATCH /api/sales/:id
router.patch("/sales/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body as Partial<{
      naverGross: number;
      naverRefund: number;
      coupangGross: number;
      coupangRefund: number;
      memo: string;
    }>;
    const [row] = await db
      .update(dashboardSales)
      .set(updates)
      .where(eq(dashboardSales.id, id!))
      .returning();
    res.json(formatRow(row!));
  } catch (err) {
    logger.error({ err }, "Error updating sales");
    res.status(500).json({ error: "Failed to update sales" });
  }
});

// POST /api/sales — create or upsert by date
router.post("/sales", async (req, res) => {
  try {
    const { date, naverGross = 0, naverRefund = 0, coupangGross = 0, coupangRefund = 0, memo = "" } =
      req.body as {
        date: string;
        naverGross?: number;
        naverRefund?: number;
        coupangGross?: number;
        coupangRefund?: number;
        memo?: string;
      };
    const [existing] = await db.select().from(dashboardSales).where(eq(dashboardSales.date, date));
    let row;
    if (existing) {
      [row] = await db
        .update(dashboardSales)
        .set({ naverGross, naverRefund, coupangGross, coupangRefund, memo })
        .where(eq(dashboardSales.id, existing.id))
        .returning();
    } else {
      const id = genId();
      [row] = await db
        .insert(dashboardSales)
        .values({ id, date, naverGross, naverRefund, coupangGross, coupangRefund, memo })
        .returning();
    }
    res.json(formatRow(row!));
  } catch (err) {
    logger.error({ err }, "Error creating sales");
    res.status(500).json({ error: "Failed to create sales" });
  }
});

export default router;
