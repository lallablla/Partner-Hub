import { pgTable, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const dashboardTasks = pgTable("dashboard_tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  phase: text("phase").notNull(),
  completed: boolean("completed").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dashboardTaskComments = pgTable("dashboard_task_comments", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => dashboardTasks.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  authorName: text("author_name").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dashboardPartnerTasks = pgTable("dashboard_partner_tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("지시완료"),
  current: integer("current").notNull().default(0),
  total: integer("total").notNull().default(0),
  unit: text("unit").notNull().default("개"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const dashboardDriveLinks = pgTable("dashboard_drive_links", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const dashboardLogs = pgTable("dashboard_logs", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dashboardSales = pgTable("dashboard_sales", {
  id: text("id").primaryKey(),
  date: text("date").notNull().unique(),
  naverGross: integer("naver_gross").notNull().default(0),
  naverRefund: integer("naver_refund").notNull().default(0),
  coupangGross: integer("coupang_gross").notNull().default(0),
  coupangRefund: integer("coupang_refund").notNull().default(0),
  memo: text("memo").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
