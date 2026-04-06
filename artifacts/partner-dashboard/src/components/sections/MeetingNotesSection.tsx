import { useState } from "react";
import { useMeetingNotes, type MeetingNote } from "../../store/useMeetingNotes";

interface Props {
  isPartner: boolean;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

interface NoteCardProps {
  note: MeetingNote;
  isPartner: boolean;
  onUpdate: (id: string, fields: Partial<Pick<MeetingNote, "date" | "title" | "content" | "pinned">>) => void;
  onDelete: (id: string) => void;
}

function NoteCard({ note, isPartner, onUpdate, onDelete }: NoteCardProps) {
  const [editing, setEditing] = useState(false);
  const [editDate, setEditDate] = useState(note.date);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleSave() {
    if (!editContent.trim()) return;
    onUpdate(note.id, { date: editDate, title: editTitle, content: editContent });
    setEditing(false);
  }

  function handleCancel() {
    setEditDate(note.date);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="text-sm bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-blue-500/60 w-full sm:w-auto"
            autoComplete="off"
          />
        </div>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="회의 제목 (선택)"
          className="w-full text-sm font-medium bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/60"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="회의 내용, 안건, 확인사항..."
          rows={6}
          className="w-full text-sm bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/60 resize-none leading-relaxed"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <div className="flex gap-2 justify-end">
          <button onClick={handleCancel} className="px-4 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all">
            취소
          </button>
          <button onClick={handleSave} className="px-4 py-1.5 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-500 transition-all font-medium">
            저장
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-4 transition-all group ${note.pinned ? "border-amber-500/30 bg-amber-500/5" : "border-white/10 bg-white/3 hover:border-white/20"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {note.pinned && (
              <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                </svg>
                고정됨
              </span>
            )}
            <span className="text-xs text-muted-foreground">{formatDate(note.date)}</span>
          </div>
          {note.title && (
            <h3 className="text-sm font-semibold text-foreground mb-2">{note.title}</h3>
          )}
          <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{note.content}</p>
        </div>

        {!isPartner && (
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onUpdate(note.id, { pinned: !note.pinned })}
              title={note.pinned ? "고정 해제" : "상단 고정"}
              className={`p-1.5 rounded-lg transition-all ${note.pinned ? "text-amber-400 hover:bg-amber-500/15" : "text-muted-foreground hover:text-amber-400 hover:bg-white/8"}`}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
              </svg>
            </button>
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-white/8 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {confirmDelete ? (
              <button
                onClick={() => { onDelete(note.id); setConfirmDelete(false); }}
                className="p-1.5 rounded-lg text-red-400 bg-red-500/15 transition-all"
                title="삭제 확인"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                onBlur={() => setConfirmDelete(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-white/8 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MeetingNotesSection({ isPartner }: Props) {
  const { pinnedNotes, regularNotes, isLoading, addNote, updateNote, deleteNote } = useMeetingNotes();
  const [showForm, setShowForm] = useState(false);
  const [newDate, setNewDate] = useState(todayStr());
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!newContent.trim()) return;
    setSaving(true);
    await addNote(newDate, newTitle.trim(), newContent.trim());
    setNewDate(todayStr());
    setNewTitle("");
    setNewContent("");
    setShowForm(false);
    setSaving(false);
  }

  const allNotes = [...pinnedNotes, ...regularNotes];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">회의록·확인사항</h2>
          <p className="text-xs text-muted-foreground mt-0.5">사장님과 논의한 내용, 안건, 확인이 필요한 사항을 기록합니다</p>
        </div>
        {!isPartner && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-all shadow-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            새 기록 추가
          </button>
        )}
      </div>

      {showForm && !isPartner && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 space-y-4">
          <p className="text-sm font-semibold text-blue-300">새 회의록·안건 기록</p>
          <div className="flex gap-3 flex-wrap">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">날짜</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="text-sm bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-blue-500/60"
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-48">
              <label className="text-xs text-muted-foreground">제목 (선택)</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="예) 피자설기 촬영 일정 회의"
                className="text-sm bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/60"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">내용 — 회의 요약, 안건, 확인사항, 결정사항 등</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={"예)\n- 촬영 일정: 4/15(화) 오전 10시 스튜디오\n- 사장님 확인 필요: 배송 박스 디자인 최종 승인\n- 다음 회의: 4/20(일) 오후 2시"}
              rows={7}
              className="text-sm bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/60 resize-none leading-relaxed"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setShowForm(false); setNewTitle(""); setNewContent(""); }} className="px-4 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all">
              취소
            </button>
            <button
              onClick={handleAdd}
              disabled={saving || !newContent.trim()}
              className="px-5 py-1.5 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-500 transition-all font-medium disabled:opacity-50"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        </div>
      ) : allNotes.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm">아직 기록된 내용이 없습니다</p>
          {!isPartner && <p className="text-xs mt-1 opacity-60">위 버튼으로 회의록을 추가해보세요</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {allNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isPartner={isPartner}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
