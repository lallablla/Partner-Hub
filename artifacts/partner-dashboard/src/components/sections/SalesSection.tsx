import { useState } from "react";
import { useSales } from "../../store/useSales";

function formatKRW(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

function parseKRW(value: string): number {
  const n = parseInt(value.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

interface EditableAmountProps {
  value: number;
  onSave: (value: number) => void;
  color?: string;
}

function EditableAmount({ value, onSave, color = "text-foreground" }: EditableAmountProps) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");

  const start = () => {
    setRaw(String(value));
    setEditing(true);
  };

  const save = () => {
    onSave(parseKRW(raw));
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={raw}
          onChange={(e) => setRaw(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          onBlur={save}
          autoFocus
          className="w-28 bg-white/10 border border-white/25 rounded-lg px-2 py-1 text-sm text-foreground text-right focus:outline-none focus:border-blue-500/50 font-mono"
        />
        <span className="text-xs text-muted-foreground">원</span>
      </div>
    );
  }

  return (
    <button
      onClick={start}
      className={`text-sm font-bold font-mono hover:opacity-70 transition-opacity ${color} tabular-nums`}
      title="클릭해서 수정"
    >
      {formatKRW(value)}
    </button>
  );
}

export default function SalesSection() {
  const { today, history, isLoading, updateToday } = useSales();
  const [memoText, setMemoText] = useState("");
  const [editingMemo, setEditingMemo] = useState(false);

  if (isLoading || !today) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  const todayLabel = new Date().toLocaleDateString("ko-KR", {
    month: "long", day: "numeric", weekday: "short",
  });

  const saveMemo = () => {
    updateToday({ memo: memoText });
    setEditingMemo(false);
  };

  return (
    <div className="space-y-6">
      {/* Today header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">오늘의 순매출 현황</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{todayLabel} · 클릭해서 금액 수정</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">오늘 합계 순매출</p>
          <p className={`text-3xl font-black tabular-nums ${today.totalNet >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {formatKRW(today.totalNet)}
          </p>
        </div>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 네이버 스마트스토어 */}
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <h3 className="text-sm font-bold text-foreground">네이버 스마트스토어</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">주문 매출</span>
              <EditableAmount
                value={today.naverGross}
                onSave={(v) => updateToday({ naverGross: v })}
                color="text-foreground"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">취소·환불</span>
              <EditableAmount
                value={today.naverRefund}
                onSave={(v) => updateToday({ naverRefund: v })}
                color="text-red-400"
              />
            </div>
            <div className="border-t border-white/8 pt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-green-300">순매출</span>
              <span className={`text-xl font-black font-mono tabular-nums ${today.naverNet >= 0 ? "text-green-400" : "text-red-400"}`}>
                {formatKRW(today.naverNet)}
              </span>
            </div>
          </div>

          {/* Mini bar */}
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${today.totalNet > 0 ? Math.min(100, (today.naverNet / today.totalNet) * 100) : 50}%` }}
            />
          </div>
        </div>

        {/* 쿠팡 */}
        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <h3 className="text-sm font-bold text-foreground">쿠팡</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">주문 매출</span>
              <EditableAmount
                value={today.coupangGross}
                onSave={(v) => updateToday({ coupangGross: v })}
                color="text-foreground"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">취소·환불</span>
              <EditableAmount
                value={today.coupangRefund}
                onSave={(v) => updateToday({ coupangRefund: v })}
                color="text-red-400"
              />
            </div>
            <div className="border-t border-white/8 pt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-orange-300">순매출</span>
              <span className={`text-xl font-black font-mono tabular-nums ${today.coupangNet >= 0 ? "text-orange-400" : "text-red-400"}`}>
                {formatKRW(today.coupangNet)}
              </span>
            </div>
          </div>

          {/* Mini bar */}
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-500"
              style={{ width: `${today.totalNet > 0 ? Math.min(100, (today.coupangNet / today.totalNet) * 100) : 50}%` }}
            />
          </div>
        </div>
      </div>

      {/* Memo */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1.5">오늘 메모</p>
            {editingMemo ? (
              <textarea
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                onBlur={saveMemo}
                onKeyDown={(e) => { if (e.key === "Escape") setEditingMemo(false); }}
                autoFocus
                rows={2}
                placeholder="특이사항, 이슈, 메모..."
                className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/50 resize-none"
              />
            ) : (
              <button
                onClick={() => { setMemoText(today.memo); setEditingMemo(true); }}
                className="w-full text-left text-sm text-foreground/70 hover:text-foreground transition-colors min-h-[2rem]"
              >
                {today.memo || <span className="text-muted-foreground italic">메모 없음 · 클릭해서 추가</span>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* History table */}
      {history.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">최근 매출 내역</h3>
          <div className="rounded-2xl border border-white/8 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/8 bg-white/3">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">날짜</th>
                  <th className="text-right px-3 py-3 text-green-400/70 font-medium">스마트스토어</th>
                  <th className="text-right px-3 py-3 text-orange-400/70 font-medium">쿠팡</th>
                  <th className="text-right px-4 py-3 text-foreground/70 font-medium">합계</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 14).map((entry, i) => {
                  const isToday = entry.id === today.id;
                  return (
                    <tr
                      key={entry.id}
                      className={`border-b border-white/5 last:border-0 ${isToday ? "bg-blue-500/5" : i % 2 === 0 ? "" : "bg-white/2"}`}
                    >
                      <td className="px-4 py-3 text-foreground/70">
                        {isToday ? (
                          <span className="text-blue-400 font-semibold">오늘</span>
                        ) : entry.date}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums text-green-400">
                        {formatKRW(entry.naverNet)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums text-orange-400">
                        {formatKRW(entry.coupangNet)}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono tabular-nums font-bold ${entry.totalNet >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {formatKRW(entry.totalNet)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
