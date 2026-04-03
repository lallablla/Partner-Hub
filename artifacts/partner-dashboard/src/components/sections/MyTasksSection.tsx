import { useState } from "react";
import type { Task, TaskPhase } from "../../types";
import ProgressBar from "../ProgressBar";

const PHASES: TaskPhase[] = ["1단계(인프라)", "2단계(상세페이지)", "3단계(마케팅)"];

const PHASE_COLORS: Record<TaskPhase, { badge: string; bar: string; dot: string }> = {
  "1단계(인프라)": { badge: "bg-blue-500/20 text-blue-300 border-blue-500/30", bar: "bg-blue-500", dot: "bg-blue-500" },
  "2단계(상세페이지)": { badge: "bg-purple-500/20 text-purple-300 border-purple-500/30", bar: "bg-purple-500", dot: "bg-purple-500" },
  "3단계(마케팅)": { badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", bar: "bg-emerald-500", dot: "bg-emerald-500" },
};

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddComment: (taskId: string, text: string) => void;
  isPartner: boolean;
}

function TaskItem({ task, onToggle, onEdit, onDelete, onAddComment, isPartner }: TaskItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const colors = PHASE_COLORS[task.phase];

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    onAddComment(task.id, commentText.trim());
    setCommentText("");
  };

  return (
    <div className={`group relative rounded-xl border transition-all duration-200 ${
      task.completed
        ? "border-white/5 bg-white/2 opacity-60"
        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
    }`}>
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
            task.completed
              ? "bg-blue-500 border-blue-500"
              : "border-white/30 hover:border-blue-400"
          }`}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium transition-all ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {task.title}
          </p>
          {task.comments.length > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              댓글 {task.comments.length}개 {showComments ? "▲" : "▼"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowComments(!showComments)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all"
            title="댓글"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          {!isPartner && (
            <>
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                title="수정"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="삭제"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4 border-t border-white/5 mt-1 pt-3 space-y-2">
          {task.comments.map((c) => (
            <div key={c.id} className={`rounded-lg p-2.5 text-xs ${c.author === "partner" ? "bg-blue-500/10 border border-blue-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
              <span className={`font-semibold ${c.author === "partner" ? "text-blue-300" : "text-amber-300"}`}>
                {c.authorName}
              </span>
              <span className="text-muted-foreground ml-2 text-xs">
                {new Date(c.createdAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              <p className="mt-1 text-foreground/80">{c.text}</p>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(); }}
              placeholder="댓글 입력..."
              className="flex-1 text-xs bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/50 focus:bg-white/8"
            />
            <button
              onClick={handleAddComment}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${isPartner ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30" : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30"}`}
            >
              {isPartner ? "사장님으로 댓글" : "댓글"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface MyTasksSectionProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onAdd: (title: string, phase: TaskPhase) => void;
  onEdit: (id: string, title: string, phase: TaskPhase) => void;
  onDelete: (id: string) => void;
  onAddComment: (taskId: string, text: string) => void;
  isPartner: boolean;
  progress: number;
}

export default function MyTasksSection({ tasks, onToggle, onAdd, onEdit, onDelete, onAddComment, isPartner, progress }: MyTasksSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPhase, setNewPhase] = useState<TaskPhase>("1단계(인프라)");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPhase, setEditPhase] = useState<TaskPhase>("1단계(인프라)");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAdd(newTitle.trim(), newPhase);
    setNewTitle("");
    setShowAddForm(false);
  };

  const handleEditStart = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditPhase(task.phase);
  };

  const handleEditSave = () => {
    if (!editingTask || !editTitle.trim()) return;
    onEdit(editingTask.id, editTitle.trim(), editPhase);
    setEditingTask(null);
  };

  const phaseGroups = PHASES.map((phase) => ({
    phase,
    tasks: tasks.filter((t) => t.phase === phase),
    colors: PHASE_COLORS[phase],
    completed: tasks.filter((t) => t.phase === phase && t.completed).length,
    total: tasks.filter((t) => t.phase === phase).length,
  }));

  const commentHandler = (taskId: string, text: string) => {
    onAddComment(taskId, text);
  };

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="rounded-2xl border border-white/10 bg-card/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">피자설기 런칭 올인 플랜</h2>
            <p className="text-xs text-muted-foreground mt-0.5">전체 진행률</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-blue-400">{progress}%</span>
            <p className="text-xs text-muted-foreground">{tasks.filter(t => t.completed).length}/{tasks.length} 완료</p>
          </div>
        </div>
        <ProgressBar value={progress} color="bg-gradient-to-r from-blue-600 to-blue-400" height="h-3" />

        {/* Phase mini progress */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {phaseGroups.map((g) => (
            <div key={g.phase} className="rounded-xl border border-white/8 bg-white/3 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className={`w-2 h-2 rounded-full ${g.colors.dot}`} />
                <span className="text-xs font-medium text-foreground/80 truncate">{g.phase}</span>
              </div>
              <ProgressBar
                value={g.total > 0 ? Math.round((g.completed / g.total) * 100) : 0}
                color={g.colors.bar}
                height="h-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1.5">{g.completed}/{g.total}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Task groups */}
      {phaseGroups.map((g) => (
        <div key={g.phase} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${g.colors.badge}`}>
              {g.phase}
            </span>
            <span className="text-xs text-muted-foreground">{g.completed}/{g.total}</span>
          </div>
          <div className="space-y-2 pl-1">
            {g.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={handleEditStart}
                onDelete={onDelete}
                onAddComment={commentHandler}
                isPartner={isPartner}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Add task */}
      {!isPartner && (
        <div>
          {showAddForm ? (
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
                placeholder="새 업무 입력..."
                autoFocus
                className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/50"
              />
              <select
                value={newPhase}
                onChange={(e) => setNewPhase(e.target.value as TaskPhase)}
                className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500/50"
              >
                {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={handleAdd} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                  추가
                </button>
                <button onClick={() => setShowAddForm(false)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-muted-foreground text-sm rounded-lg transition-colors">
                  취소
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 rounded-xl border border-dashed border-white/15 text-sm text-muted-foreground hover:border-blue-500/40 hover:text-blue-400 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              업무 추가
            </button>
          )}
        </div>
      )}

      {/* Edit modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-card p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground">업무 수정</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleEditSave(); }}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-blue-500/50"
              autoFocus
            />
            <select
              value={editPhase}
              onChange={(e) => setEditPhase(e.target.value as TaskPhase)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-blue-500/50"
            >
              {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={handleEditSave} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">저장</button>
              <button onClick={() => setEditingTask(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-muted-foreground text-sm rounded-lg transition-colors">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
