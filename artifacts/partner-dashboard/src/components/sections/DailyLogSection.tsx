import { useState } from "react";
import type { LogEntry } from "../../types";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${min}`;
}

interface DailyLogSectionProps {
  logs: LogEntry[];
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
}

export default function DailyLogSection({ logs, onAdd, onDelete }: DailyLogSectionProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput("");
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder="오늘 한 일을 기록하세요... (예: 피자설기 촬영 완료)"
          className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors flex-shrink-0 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          기록
        </button>
      </div>

      {/* Timeline */}
      {logs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">아직 기록이 없습니다. 오늘 한 일을 기록해보세요!</p>
        </div>
      ) : (
        <div className="relative space-y-2">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />

          {logs.map((log) => (
            <div key={log.id} className="group relative flex items-start gap-4 pl-5">
              {/* Dot */}
              <div className="absolute left-0 top-2.5 w-3.5 h-3.5 rounded-full bg-blue-500/30 border-2 border-blue-500 flex-shrink-0" />

              <div className="flex-1 rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/15 p-3.5 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-mono text-muted-foreground mb-1.5">{formatDateTime(log.createdAt)}</p>
                    <p className="text-sm text-foreground leading-relaxed">[{log.text}]</p>
                  </div>
                  <button
                    onClick={() => onDelete(log.id)}
                    className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all mt-0.5"
                    title="삭제"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        기록은 브라우저에 저장됩니다. 새로고침 후에도 유지됩니다.
      </p>
    </div>
  );
}
