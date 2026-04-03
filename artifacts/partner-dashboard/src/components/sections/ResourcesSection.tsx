import { useState } from "react";
import type { DriveLink } from "../../types";

const DRIVE_ICONS = [
  <svg key="camera" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>,
  <svg key="book" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>,
  <svg key="chart" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>,
];

const CARD_COLORS = [
  "border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-500/8",
  "border-blue-500/30 hover:border-blue-400/50 hover:bg-blue-500/8",
  "border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-500/8",
];

const ICON_COLORS = [
  "bg-emerald-500/15 text-emerald-400",
  "bg-blue-500/15 text-blue-400",
  "bg-purple-500/15 text-purple-400",
];

interface ResourcesSectionProps {
  driveLinks: DriveLink[];
  onUpdateUrl: (id: string, url: string) => void;
  isPartner: boolean;
}

export default function ResourcesSection({ driveLinks, onUpdateUrl, isPartner }: ResourcesSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempUrl, setTempUrl] = useState("");

  const handleEditStart = (link: DriveLink) => {
    setEditingId(link.id);
    setTempUrl(link.url);
  };

  const handleSave = (id: string) => {
    if (tempUrl.trim()) {
      onUpdateUrl(id, tempUrl.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {driveLinks.map((link, i) => (
          <div key={link.id} className={`group relative rounded-2xl border bg-white/3 p-5 transition-all duration-200 cursor-pointer ${CARD_COLORS[i]}`}>
            {editingId === link.id ? (
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSave(link.id); if (e.key === "Escape") setEditingId(null); }}
                  placeholder="Google Drive URL"
                  autoFocus
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/50"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(link.id)} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors">저장</button>
                  <button onClick={() => setEditingId(null)} className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-muted-foreground text-xs rounded-lg transition-colors">취소</button>
                </div>
              </div>
            ) : (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${ICON_COLORS[i]}`}>
                    {DRIVE_ICONS[i]}
                  </div>
                  {/* Google Drive icon */}
                  <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 87.3 78" fill="none">
                    <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L26.8 56H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066DA"/>
                    <path d="M43.65 25L30.6 2.1c-1.35.8-2.5 1.9-3.3 3.3l-25.1 43.5a9.06 9.06 0 00-1.2 4.5h26.8z" fill="#00AC47"/>
                    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H60.5l5.45 10.5z" fill="#EA4335"/>
                    <path d="M43.65 25L56.7 2.1C55.35 1.3 53.8.9 52.2.9H35.1c-1.6 0-3.15.45-4.5 1.2z" fill="#00832D"/>
                    <path d="M60.5 53H26.8L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684FC"/>
                    <path d="M73.4 26.5l-12.55-21.7c-.8-1.4-1.95-2.5-3.3-3.3L44.5 25l16 28h26.65c0-1.55-.4-3.1-1.2-4.5z" fill="#FFBA00"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-foreground group-hover:text-white transition-colors">{link.label}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{link.url}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  열기
                </div>
              </a>
            )}

            {!isPartner && editingId !== link.id && (
              <button
                onClick={(e) => { e.preventDefault(); handleEditStart(link); }}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-all"
                title="URL 수정"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {!isPartner && (
        <p className="text-xs text-muted-foreground text-center">
          각 카드 우측 상단의 수정 버튼으로 Google Drive URL을 설정하세요.
        </p>
      )}
    </div>
  );
}
