import { useState } from "react";
import type { PartnerTask, PartnerStatus } from "../../types";
import ProgressBar from "../ProgressBar";

const STATUS_CONFIG: Record<PartnerStatus, { label: string; color: string; bg: string; dot: string }> = {
  "지시완료": {
    label: "지시완료",
    color: "text-blue-300",
    bg: "bg-blue-500/15 border-blue-500/30",
    dot: "bg-blue-400",
  },
  "이행중": {
    label: "이행중",
    color: "text-amber-300",
    bg: "bg-amber-500/15 border-amber-500/30",
    dot: "bg-amber-400",
  },
  "미이행(경고)": {
    label: "미이행 경고",
    color: "text-red-300",
    bg: "bg-red-500/15 border-red-500/30",
    dot: "bg-red-400",
  },
};

const STATUS_BAR: Record<PartnerStatus, string> = {
  "지시완료": "bg-blue-500",
  "이행중": "bg-amber-500",
  "미이행(경고)": "bg-red-500",
};

interface PartnerTaskCardProps {
  task: PartnerTask;
  onUpdate: (id: string, updates: Partial<Pick<PartnerTask, "status" | "current" | "total" | "title">>) => void;
  onDelete: (id: string) => void;
}

function PartnerTaskCard({ task, onUpdate, onDelete }: PartnerTaskCardProps) {
  const [editingCurrent, setEditingCurrent] = useState(false);
  const [tempCurrent, setTempCurrent] = useState(String(task.current));
  const status = STATUS_CONFIG[task.status];
  const pct = task.total > 0 ? Math.round((task.current / task.total) * 100) : 0;

  const handleSaveCurrent = () => {
    const val = parseInt(tempCurrent, 10);
    if (!isNaN(val) && val >= 0 && val <= task.total) {
      onUpdate(task.id, { current: val });
    }
    setEditingCurrent(false);
  };

  return (
    <div className={`rounded-2xl border p-5 space-y-4 transition-all duration-200 ${
      task.status === "미이행(경고)"
        ? "border-red-500/30 bg-red-500/5 glow-red"
        : task.status === "이행중"
        ? "border-amber-500/20 bg-amber-500/3"
        : "border-white/10 bg-white/3"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{task.title}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.bg} ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${task.status === "이행중" ? "animate-pulse" : ""}`} />
              {status.label}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">이행 현황</span>
          <div className="flex items-center gap-2">
            {editingCurrent ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={tempCurrent}
                  onChange={(e) => setTempCurrent(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveCurrent(); if (e.key === "Escape") setEditingCurrent(false); }}
                  className="w-14 bg-white/10 border border-white/20 rounded px-2 py-0.5 text-xs text-foreground text-center focus:outline-none focus:border-blue-500/50"
                  min={0}
                  max={task.total}
                  autoFocus
                />
                <span className="text-muted-foreground">/ {task.total}{task.unit}</span>
                <button onClick={handleSaveCurrent} className="text-blue-400 hover:text-blue-300 text-xs">✓</button>
              </div>
            ) : (
              <button
                onClick={() => { setEditingCurrent(true); setTempCurrent(String(task.current)); }}
                className="text-foreground hover:text-blue-400 transition-colors font-mono"
              >
                {task.current}/{task.total}{task.unit}
              </button>
            )}
            <span className={`font-bold ${pct >= 100 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400"}`}>
              {pct}%
            </span>
          </div>
        </div>
        <ProgressBar value={pct} color={STATUS_BAR[task.status]} height="h-2" />
      </div>

      {/* Status selector */}
      <div className="flex gap-2">
        {(["지시완료", "이행중", "미이행(경고)"] as PartnerStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => onUpdate(task.id, { status: s })}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              task.status === s
                ? STATUS_CONFIG[s].bg + " " + STATUS_CONFIG[s].color
                : "border-white/10 bg-white/3 text-muted-foreground hover:border-white/20"
            }`}
          >
            {s === "미이행(경고)" ? "미이행" : s}
          </button>
        ))}
      </div>
    </div>
  );
}

interface PartnerManagementSectionProps {
  partnerTasks: PartnerTask[];
  partnerProgress: number;
  myProgress: number;
  onUpdate: (id: string, updates: Partial<Pick<PartnerTask, "status" | "current" | "total" | "title">>) => void;
  onAdd: (title: string, total: number, unit: string) => void;
  onDelete: (id: string) => void;
}

export default function PartnerManagementSection({ partnerTasks, partnerProgress, myProgress, onUpdate, onAdd, onDelete }: PartnerManagementSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTotal, setNewTotal] = useState("10");
  const [newUnit, setNewUnit] = useState("개");

  const handleAdd = () => {
    if (!newTitle.trim() || !newTotal) return;
    onAdd(newTitle.trim(), parseInt(newTotal, 10), newUnit);
    setNewTitle("");
    setNewTotal("10");
    setShowAddForm(false);
  };

  const warningCount = partnerTasks.filter(t => t.status === "미이행(경고)").length;

  return (
    <div className="space-y-5">
      {/* Comparison banner */}
      <div className="rounded-2xl border border-white/10 bg-card/50 p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">파트너 이행률 비교</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-foreground">나의 업무 진행률</span>
              </div>
              <span className="text-xl font-black text-blue-400">{myProgress}%</span>
            </div>
            <ProgressBar value={myProgress} color="bg-blue-500" height="h-2.5" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${warningCount > 0 ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
                <span className="text-sm font-medium text-foreground">외부업체(유얼스) 이행률</span>
                {warningCount > 0 && (
                  <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full">
                    미이행 {warningCount}건
                  </span>
                )}
              </div>
              <span className={`text-xl font-black ${partnerProgress < 30 ? "text-red-400" : partnerProgress < 60 ? "text-amber-400" : "text-emerald-400"}`}>
                {partnerProgress}%
              </span>
            </div>
            <ProgressBar
              value={partnerProgress}
              color={partnerProgress < 30 ? "bg-red-500" : partnerProgress < 60 ? "bg-amber-500" : "bg-emerald-500"}
              height="h-2.5"
            />
          </div>
        </div>

        {myProgress > partnerProgress && (
          <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300">
            파트너 대비 <strong>{myProgress - partnerProgress}%p</strong> 앞서 진행 중입니다.
          </div>
        )}
      </div>

      {/* Partner tasks */}
      <div className="space-y-3">
        {partnerTasks.map((task) => (
          <PartnerTaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </div>

      {/* Add form */}
      {showAddForm ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="업무 지시 내용..."
            autoFocus
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500/50"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={newTotal}
              onChange={(e) => setNewTotal(e.target.value)}
              placeholder="목표 수량"
              className="w-24 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-amber-500/50"
            />
            <input
              type="text"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              placeholder="단위"
              className="w-16 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-amber-500/50"
            />
            <button onClick={handleAdd} className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors">추가</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-muted-foreground text-sm rounded-lg transition-colors">취소</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 rounded-xl border border-dashed border-white/15 text-sm text-muted-foreground hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          업무 지시 추가
        </button>
      )}
    </div>
  );
}
