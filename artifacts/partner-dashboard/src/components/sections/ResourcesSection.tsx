import { useState } from "react";
import type { DriveLink } from "../../types";

const CARD_PALETTE = [
  {
    border: "border-emerald-500/30 hover:border-emerald-400/50",
    bg: "hover:bg-emerald-500/8",
    icon: "bg-emerald-500/15 text-emerald-400",
    dot: "bg-emerald-400",
  },
  {
    border: "border-blue-500/30 hover:border-blue-400/50",
    bg: "hover:bg-blue-500/8",
    icon: "bg-blue-500/15 text-blue-400",
    dot: "bg-blue-400",
  },
  {
    border: "border-purple-500/30 hover:border-purple-400/50",
    bg: "hover:bg-purple-500/8",
    icon: "bg-purple-500/15 text-purple-400",
    dot: "bg-purple-400",
  },
  {
    border: "border-amber-500/30 hover:border-amber-400/50",
    bg: "hover:bg-amber-500/8",
    icon: "bg-amber-500/15 text-amber-400",
    dot: "bg-amber-400",
  },
  {
    border: "border-rose-500/30 hover:border-rose-400/50",
    bg: "hover:bg-rose-500/8",
    icon: "bg-rose-500/15 text-rose-400",
    dot: "bg-rose-400",
  },
  {
    border: "border-cyan-500/30 hover:border-cyan-400/50",
    bg: "hover:bg-cyan-500/8",
    icon: "bg-cyan-500/15 text-cyan-400",
    dot: "bg-cyan-400",
  },
];

const FolderIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const DriveIcon = () => (
  <svg className="w-4 h-4 opacity-40 group-hover:opacity-80 transition-opacity flex-shrink-0" viewBox="0 0 87.3 78" fill="none">
    <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L26.8 56H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066DA"/>
    <path d="M43.65 25L30.6 2.1c-1.35.8-2.5 1.9-3.3 3.3l-25.1 43.5a9.06 9.06 0 00-1.2 4.5h26.8z" fill="#00AC47"/>
    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H60.5l5.45 10.5z" fill="#EA4335"/>
    <path d="M43.65 25L56.7 2.1C55.35 1.3 53.8.9 52.2.9H35.1c-1.6 0-3.15.45-4.5 1.2z" fill="#00832D"/>
    <path d="M60.5 53H26.8L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684FC"/>
    <path d="M73.4 26.5l-12.55-21.7c-.8-1.4-1.95-2.5-3.3-3.3L44.5 25l16 28h26.65c0-1.55-.4-3.1-1.2-4.5z" fill="#FFBA00"/>
  </svg>
);

interface EditState {
  id: string;
  field: "label" | "url" | "both";
  label: string;
  url: string;
}

interface ResourcesSectionProps {
  driveLinks: DriveLink[];
  onUpdateUrl: (id: string, url: string) => void;
  onUpdateLabel: (id: string, label: string) => void;
  onAdd: (label: string, url: string) => void;
  onDelete: (id: string) => void;
  isPartner: boolean;
}

export default function ResourcesSection({
  driveLinks,
  onUpdateUrl,
  onUpdateLabel,
  onAdd,
  onDelete,
  isPartner,
}: ResourcesSectionProps) {
  const [edit, setEdit] = useState<EditState | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const startEdit = (link: DriveLink) => {
    setEdit({ id: link.id, field: "both", label: link.label, url: link.url });
  };

  const saveEdit = () => {
    if (!edit) return;
    if (edit.label.trim()) onUpdateLabel(edit.id, edit.label.trim());
    if (edit.url.trim()) onUpdateUrl(edit.id, edit.url.trim());
    setEdit(null);
  };

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    onAdd(newLabel.trim(), newUrl.trim() || "https://drive.google.com");
    setNewLabel("");
    setNewUrl("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">리소스 폴더</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Google Drive 폴더 링크를 관리합니다</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEdit(null); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          폴더 추가
        </button>
      </div>

      {/* Add new card */}
      {showAdd && (
        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/5 p-5 space-y-3">
          <p className="text-sm font-semibold text-blue-300">새 폴더 추가</p>
          <div className="space-y-2">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="폴더 이름 (예: 촬영 원본 폴더)"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowAdd(false); }}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/60"
            />
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Google Drive URL (선택사항)"
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowAdd(false); }}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/60"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newLabel.trim()}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              추가
            </button>
            <button
              onClick={() => { setShowAdd(false); setNewLabel(""); setNewUrl(""); }}
              className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-muted-foreground text-sm rounded-lg transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {driveLinks.map((link, i) => {
          const palette = CARD_PALETTE[i % CARD_PALETTE.length];
          const isEditing = edit?.id === link.id;

          return (
            <div
              key={link.id}
              className={`group relative rounded-2xl border bg-white/3 transition-all duration-200 ${palette.border} ${palette.bg}`}
            >
              {isEditing ? (
                /* ── Edit mode ── */
                <div className="p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs font-semibold text-blue-300 mb-1">폴더 수정</p>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">폴더 이름</label>
                      <input
                        type="text"
                        value={edit.label}
                        onChange={(e) => setEdit({ ...edit, label: e.target.value })}
                        autoFocus
                        onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEdit(null); }}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Google Drive URL</label>
                      <input
                        type="url"
                        value={edit.url}
                        onChange={(e) => setEdit({ ...edit, url: e.target.value })}
                        onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEdit(null); }}
                        placeholder="https://drive.google.com/..."
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors">저장</button>
                    <button onClick={() => setEdit(null)} className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-muted-foreground text-xs rounded-lg transition-colors">취소</button>
                  </div>
                </div>
              ) : confirmDelete === link.id ? (
                /* ── Delete confirm ── */
                <div className="p-5 space-y-3">
                  <p className="text-sm text-foreground font-medium">"{link.label}" 폴더를 삭제할까요?</p>
                  <div className="flex gap-2">
                    <button onClick={() => { onDelete(link.id); setConfirmDelete(null); }} className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors">삭제</button>
                    <button onClick={() => setConfirmDelete(null)} className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-muted-foreground text-xs rounded-lg transition-colors">취소</button>
                  </div>
                </div>
              ) : (
                /* ── Normal view ── */
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${palette.icon}`}>
                      <FolderIcon />
                    </div>
                    <DriveIcon />
                  </div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-white transition-colors leading-snug">
                    {link.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{link.url}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    열기
                  </div>
                </a>
              )}

              {/* Action buttons (top-right), visible on hover */}
              {!isEditing && confirmDelete !== link.id && (
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.preventDefault(); startEdit(link); }}
                    title="수정"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/15 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); setConfirmDelete(link.id); }}
                    title="삭제"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/15 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {driveLinks.length === 0 && !showAdd && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-2xl bg-white/5 mb-4">
              <FolderIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">아직 등록된 폴더가 없습니다</p>
            <p className="text-xs text-muted-foreground/60 mt-1">위의 "폴더 추가" 버튼으로 구글 드라이브 링크를 추가하세요</p>
          </div>
        )}
      </div>

      {driveLinks.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          카드에 마우스를 올리면 수정·삭제 버튼이 나타납니다
        </p>
      )}
    </div>
  );
}
