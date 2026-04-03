import { useState } from "react";
import type { TaskPhase } from "../../types";

interface ParsedTask {
  title: string;
  phase: TaskPhase | string;
}

interface AIAssistantSectionProps {
  onAddTasks: (tasks: { title: string; phase: TaskPhase }[]) => void;
}

const VALID_PHASES: TaskPhase[] = ["1단계(인프라)", "2단계(상세페이지)", "3단계(마케팅)"];

function toValidPhase(phase: string): TaskPhase {
  if (VALID_PHASES.includes(phase as TaskPhase)) return phase as TaskPhase;
  return "1단계(인프라)";
}

export default function AIAssistantSection({ onAddTasks }: AIAssistantSectionProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parsedTasks, setParsedTasks] = useState<ParsedTask[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());

  const handleParse = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError("");
    setParsedTasks([]);
    setMessage("");
    setSelectedTasks(new Set());

    try {
      const res = await fetch("/api/ai/parse-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input.trim(),
          context: "피자설기 런칭 마케팅 프로젝트",
        }),
      });

      if (!res.ok) {
        throw new Error("AI 분석에 실패했습니다");
      }

      const data = await res.json() as { tasks: ParsedTask[]; message: string };
      setParsedTasks(data.tasks || []);
      setMessage(data.message || "");
      setSelectedTasks(new Set(data.tasks.map((_, i) => i)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = (idx: number) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleAddSelected = () => {
    const tasksToAdd = parsedTasks
      .filter((_, i) => selectedTasks.has(i))
      .map((t) => ({ title: t.title, phase: toValidPhase(t.phase) }));
    if (tasksToAdd.length === 0) return;
    onAddTasks(tasksToAdd);
    setParsedTasks([]);
    setMessage("");
    setInput("");
    setSelectedTasks(new Set());
  };

  const PHASE_COLORS: Record<string, string> = {
    "1단계(인프라)": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "2단계(상세페이지)": "bg-purple-500/20 text-purple-300 border-purple-500/30",
    "3단계(마케팅)": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "기타": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  };

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
              해야 할 업무를 자유롭게 입력하면 AI가 분석하여 단계별로 정리해 업무 목록에 추가해드립니다.
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
          placeholder={`예시:\n"인스타그램에 피자설기 홍보 콘텐츠 올리기, 네이버 쇼핑 등록, 유튜브 썸네일 제작, 인플루언서 컨택해서 협업 제안하기"`}
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
              AI로 업무 분석 (Ctrl+Enter)
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
      {parsedTasks.length > 0 && (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 space-y-3">
          {message && (
            <p className="text-sm text-emerald-300 font-medium">{message}</p>
          )}
          <p className="text-xs text-muted-foreground">추가할 업무를 선택하세요:</p>

          <div className="space-y-2">
            {parsedTasks.map((task, i) => (
              <label
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedTasks.has(i)
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-white/10 bg-white/3 opacity-60"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTasks.has(i)}
                  onChange={() => handleToggleTask(i)}
                  className="w-4 h-4 rounded accent-emerald-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${PHASE_COLORS[task.phase] ?? PHASE_COLORS["기타"]}`}>
                    {task.phase}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddSelected}
              disabled={selectedTasks.size === 0}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
            >
              선택한 {selectedTasks.size}개 업무 추가
            </button>
            <button
              onClick={() => { setParsedTasks([]); setMessage(""); }}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-muted-foreground text-sm rounded-xl transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
