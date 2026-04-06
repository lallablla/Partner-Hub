import { useState } from "react";
import type { TaskPhase } from "../../types";

interface ParsedMyTask {
  title: string;
  phase: TaskPhase | string;
}

interface ParsedPartnerTask {
  title: string;
  total: number;
  unit: string;
}

interface AIAssistantSectionProps {
  onAddTasks: (tasks: { title: string; phase: TaskPhase }[]) => void;
  onAddPartnerTask: (title: string, total: number, unit: string) => void;
}

const VALID_PHASES: TaskPhase[] = ["1단계(인프라)", "2단계(상세페이지)", "3단계(마케팅)"];

function toValidPhase(phase: string): TaskPhase {
  if (VALID_PHASES.includes(phase as TaskPhase)) return phase as TaskPhase;
  return "3단계(마케팅)";
}

const PHASE_COLORS: Record<string, string> = {
  "1단계(인프라)": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "2단계(상세페이지)": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "3단계(마케팅)": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

export default function AIAssistantSection({ onAddTasks, onAddPartnerTask }: AIAssistantSectionProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [myTasks, setMyTasks] = useState<ParsedMyTask[]>([]);
  const [partnerTasks, setPartnerTasks] = useState<ParsedPartnerTask[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedMyTasks, setSelectedMyTasks] = useState<Set<number>>(new Set());
  const [selectedPartnerTasks, setSelectedPartnerTasks] = useState<Set<number>>(new Set());
  const [added, setAdded] = useState(false);

  const reset = () => {
    setMyTasks([]);
    setPartnerTasks([]);
    setMessage("");
    setSelectedMyTasks(new Set());
    setSelectedPartnerTasks(new Set());
    setAdded(false);
  };

  const handleParse = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError("");
    reset();

    try {
      const res = await fetch("/api/ai/parse-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input.trim(),
          context: "마시떡 피자설기 온라인 런칭 플랜 마케팅 프로젝트",
        }),
      });

      if (!res.ok) throw new Error("AI 분석에 실패했습니다");

      const data = await res.json() as {
        tasks?: ParsedMyTask[];
        partnerTasks?: ParsedPartnerTask[];
        message?: string;
      };

      const myT = data.tasks || [];
      const partnerT = data.partnerTasks || [];

      setMyTasks(myT);
      setPartnerTasks(partnerT);
      setMessage(data.message || "");
      setSelectedMyTasks(new Set(myT.map((_, i) => i)));
      setSelectedPartnerTasks(new Set(partnerT.map((_, i) => i)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMy = (idx: number) =>
    setSelectedMyTasks((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });

  const togglePartner = (idx: number) =>
    setSelectedPartnerTasks((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });

  const handleAddSelected = async () => {
    const tasksToAdd = myTasks
      .filter((_, i) => selectedMyTasks.has(i))
      .map((t) => ({ title: t.title, phase: toValidPhase(t.phase) }));

    const partnerToAdd = partnerTasks.filter((_, i) => selectedPartnerTasks.has(i));

    if (tasksToAdd.length > 0) onAddTasks(tasksToAdd);
    for (const pt of partnerToAdd) {
      await onAddPartnerTask(pt.title, pt.total || 1, pt.unit || "개");
    }

    setAdded(true);
    setTimeout(() => {
      reset();
      setInput("");
    }, 1500);
  };

  const totalSelected = selectedMyTasks.size + selectedPartnerTasks.size;
  const hasResults = myTasks.length > 0 || partnerTasks.length > 0;

  return (
    <div className="space-y-4">
      {/* Info */}
      <div className="rounded-xl bg-blue-500/8 border border-blue-500/20 p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-300">AI 업무 보조</p>
            <p className="text-xs text-muted-foreground mt-1">
              업무를 자유롭게 입력하면 AI가 <span className="text-blue-300">내 업무(My Task)</span>와 <span className="text-amber-300">유얼스 지시 업무(파트너 관리)</span>로 자동 분류합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleParse(); }}
          placeholder={`예시:\n"유얼스한테 맘카페 바이럴 30건 올려달라고 하고, 체험단 20명 모집 요청하기. 나는 인스타 릴스 만들고 쿠팡 광고 세팅하기"`}
          rows={4}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all resize-none"
        />
        <button
          onClick={handleParse}
          disabled={isLoading || !input.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI 분석 중...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              AI로 업무 분류하기 (Ctrl+Enter)
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div className="space-y-3">
          {message && (
            <p className="text-sm text-blue-300 font-medium px-1">{message}</p>
          )}

          {/* My Task results */}
          {myTasks.length > 0 && (
            <div className="rounded-xl border border-blue-500/25 bg-blue-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="text-sm font-semibold text-blue-300">My Task ({myTasks.length}개)</span>
                <span className="text-xs text-muted-foreground">내가 직접 할 업무</span>
              </div>
              {myTasks.map((task, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedMyTasks.has(i)
                      ? "border-blue-500/40 bg-blue-500/10"
                      : "border-white/10 bg-white/3 opacity-60"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMyTasks.has(i)}
                    onChange={() => toggleMy(i)}
                    className="w-4 h-4 rounded accent-blue-500 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${PHASE_COLORS[task.phase] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                      {task.phase}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Partner Task results */}
          {partnerTasks.length > 0 && (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-semibold text-amber-300">파트너 관리 ({partnerTasks.length}개)</span>
                <span className="text-xs text-muted-foreground">유얼스에 지시할 업무</span>
              </div>
              {partnerTasks.map((task, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedPartnerTasks.has(i)
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-white/10 bg-white/3 opacity-60"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPartnerTasks.has(i)}
                    onChange={() => togglePartner(i)}
                    className="w-4 h-4 rounded accent-amber-500 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full border mt-1 inline-block bg-amber-500/20 text-amber-300 border-amber-500/30">
                      목표 {task.total}{task.unit}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Action buttons */}
          {added ? (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-emerald-400 font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              추가 완료!
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleAddSelected}
                disabled={totalSelected === 0}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
              >
                선택한 {totalSelected}개 업무 추가
              </button>
              <button
                onClick={() => { reset(); setInput(""); }}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-muted-foreground text-sm rounded-xl transition-colors"
              >
                취소
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
