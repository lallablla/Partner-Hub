import { useState } from "react";
import { useDashboard } from "../store/useDashboard";
import type { TaskPhase } from "../types";
import MyTasksSection from "../components/sections/MyTasksSection";
import PartnerManagementSection from "../components/sections/PartnerManagementSection";
import ResourcesSection from "../components/sections/ResourcesSection";
import DailyLogSection from "../components/sections/DailyLogSection";
import AIAssistantSection from "../components/sections/AIAssistantSection";

type Tab = "tasks" | "partner" | "resources" | "log" | "ai";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "tasks",
    label: "My Task",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    id: "partner",
    label: "파트너 관리",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "resources",
    label: "Resources",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    id: "log",
    label: "Daily Log",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "ai",
    label: "AI 보조",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("tasks");
  const [isPartnerMode, setIsPartnerMode] = useState(false);
  const dashboard = useDashboard();

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted-foreground leading-none">마시떡의 성장을 위한 파트너 전용 공간</p>
                <h1 className="text-sm font-bold text-foreground leading-tight">마케팅 파트너 대시보드</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="hidden sm:block text-xs text-muted-foreground">{today}</p>

              {/* Mode toggle */}
              <div className="flex rounded-xl border border-white/15 overflow-hidden">
                <button
                  onClick={() => setIsPartnerMode(false)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all ${
                    !isPartnerMode
                      ? "bg-blue-600 text-white"
                      : "bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  파트너
                </button>
                <button
                  onClick={() => setIsPartnerMode(true)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all ${
                    isPartnerMode
                      ? "bg-amber-600 text-white"
                      : "bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  사장님
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div className="border-b border-white/8 bg-gradient-to-r from-blue-950/50 via-background to-purple-950/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                피자설기 <span className="text-blue-400">런칭 올인</span> 플랜
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isPartnerMode
                  ? "마시떡 사장님, 업무 현황을 확인하고 코멘트를 남겨주세요."
                  : "실시간 업무 현황을 사장님과 공유하는 전용 대시보드입니다."}
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-3">
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/8 px-4 py-3 text-center">
                <p className="text-2xl font-black text-blue-400">{dashboard.myProgress}%</p>
                <p className="text-xs text-muted-foreground mt-0.5">나의 진행률</p>
              </div>
              <div className={`rounded-xl border px-4 py-3 text-center ${
                dashboard.partnerProgress < 30
                  ? "border-red-500/20 bg-red-500/8"
                  : "border-amber-500/20 bg-amber-500/8"
              }`}>
                <p className={`text-2xl font-black ${dashboard.partnerProgress < 30 ? "text-red-400" : "text-amber-400"}`}>
                  {dashboard.partnerProgress}%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">유월스 이행률</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 border-b border-white/8 bg-background/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
            {TABS.filter((t) => !isPartnerMode || t.id !== "ai").map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/8"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.id === "log" && dashboard.state.logs.length > 0 && (
                  <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    {dashboard.state.logs.length}
                  </span>
                )}
                {tab.id === "partner" && dashboard.state.partnerTasks.filter(t => t.status === "미이행(경고)").length > 0 && (
                  <span className="text-xs bg-red-500 px-1.5 py-0.5 rounded-full animate-pulse">
                    {dashboard.state.partnerTasks.filter(t => t.status === "미이행(경고)").length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "tasks" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">My Task</h2>
              {isPartnerMode && (
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-full">
                  코멘트만 가능합니다
                </span>
              )}
            </div>
            <MyTasksSection
              tasks={dashboard.state.tasks}
              onToggle={dashboard.toggleTask}
              onAdd={(title: string, phase: TaskPhase) => dashboard.addTask(title, phase)}
              onEdit={(id: string, title: string, phase: TaskPhase) => dashboard.updateTask(id, title, phase)}
              onDelete={dashboard.deleteTask}
              onAddComment={(taskId: string, text: string) =>
                dashboard.addComment(taskId, text, isPartnerMode ? "boss" : "partner")
              }
              isPartner={isPartnerMode}
              progress={dashboard.myProgress}
            />
          </div>
        )}

        {activeTab === "partner" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">파트너 관리</h2>
                <p className="text-xs text-muted-foreground mt-0.5">유월스마케팅 강제 이행 관리</p>
              </div>
            </div>
            <PartnerManagementSection
              partnerTasks={dashboard.state.partnerTasks}
              partnerProgress={dashboard.partnerProgress}
              myProgress={dashboard.myProgress}
              onUpdate={dashboard.updatePartnerTask}
              onAdd={dashboard.addPartnerTask}
              onDelete={dashboard.deletePartnerTask}
            />
          </div>
        )}

        {activeTab === "resources" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">Resources</h2>
              <p className="text-xs text-muted-foreground mt-0.5">구글 드라이브 실시간 링크</p>
            </div>
            <ResourcesSection
              driveLinks={dashboard.state.driveLinks}
              onUpdateUrl={dashboard.updateDriveLink}
              isPartner={isPartnerMode}
            />
          </div>
        )}

        {activeTab === "log" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">Daily Log</h2>
              <p className="text-xs text-muted-foreground mt-0.5">업무 히스토리 기록</p>
            </div>
            <DailyLogSection
              logs={dashboard.state.logs}
              onAdd={dashboard.addLog}
              onDelete={dashboard.deleteLog}
            />
          </div>
        )}

        {activeTab === "ai" && !isPartnerMode && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">AI 업무 보조</h2>
              <p className="text-xs text-muted-foreground mt-0.5">자연어로 업무를 입력하면 AI가 자동으로 정리합니다</p>
            </div>
            <AIAssistantSection onAddTasks={dashboard.addMultipleTasks} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/8 mt-16 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xs text-muted-foreground">
          마시떡 × 마케팅 파트너 대시보드 · 업무 현황은 실시간 공유됩니다.
        </div>
      </footer>
    </div>
  );
}
